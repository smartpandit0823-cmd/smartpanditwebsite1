import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/jwt/user-session";
import connectDB from "@/lib/db/mongodb";
import Payment from "@/models/Payment";
import Booking from "@/models/Booking";
import Order from "@/models/Order";
import Product from "@/models/Product";
import AstroRequest from "@/models/AstroRequest";
import Notification from "@/models/Notification";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { logApiError } from "@/lib/api-logger";
import { z } from "zod";
import { createShipment } from "@/lib/shipping/delhivery";

const BodySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getUserFromCookie();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

    const valid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    await connectDB();

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
      userId: session.userId,
    });
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }
    if (payment.status === "captured") {
      return NextResponse.json({ success: true, entityType: payment.entityType, entityId: payment.entityId.toString() });
    }

    await Payment.findByIdAndUpdate(payment._id, {
      status: "captured",
      razorpayPaymentId: razorpay_payment_id,
      gatewayData: { verifiedAt: new Date() },
    });

    if (payment.entityType === "booking") {
      const booking = await Booking.findById(payment.entityId);
      if (booking) {
        const newAmountPaid = (booking.amountPaid || 0) + payment.amount;
        const isFullyPaid = newAmountPaid >= booking.amount;

        await Booking.findByIdAndUpdate(payment.entityId, {
          status: "confirmed",
          paymentStatus: isFullyPaid ? "paid" : "partial",
          amountPaid: newAmountPaid,
          razorpayPaymentId: razorpay_payment_id,
          $push: {
            statusHistory: {
              status: "confirmed",
              at: new Date(),
              note: isFullyPaid ? "Full payment verified" : `Advance payment of ₹${payment.amount} verified`,
            },
          },
        });
      }
      await Notification.create({
        userId: payment.userId,
        title: "Booking Confirmed",
        message: "Your puja booking payment is confirmed. Our team will assign a pandit soon.",
        read: false,
      });
    } else if (payment.entityType === "order") {
      const order = await Order.findById(payment.entityId).populate("items.productId");
      let delhiveryWaybill;
      let delhiveryStatus;

      if (order) {
        // Find total weight of the order
        const totalWeightGrams = order.items.reduce((acc, i) => acc + (500 * i.quantity), 0);

        try {
          const shipmentRes = await createShipment({
            orderId: order._id.toString(),
            customerName: order.shippingAddress.name,
            customerPhone: order.shippingAddress.phone,
            customerAddress: order.shippingAddress.address,
            customerCity: order.shippingAddress.city,
            customerState: order.shippingAddress.state,
            customerPincode: order.shippingAddress.pincode,
            paymentMode: "Prepaid",
            codAmount: 0,
            totalAmount: order.totalAmount,
            productDesc: order.items.map((i) => i.name).join(", "),
            weight: totalWeightGrams,
            quantity: order.items.reduce((acc, i) => acc + i.quantity, 0),
          });

          if (shipmentRes.success && shipmentRes.waybill) {
            delhiveryWaybill = shipmentRes.waybill;
            delhiveryStatus = "Manifested";
          } else {
            console.error("Delhivery Paid Shipment failed: ", shipmentRes.error);
          }
        } catch (err) {
          console.error("Delhivery API connection failed: ", err);
        }
      }

      await Order.findByIdAndUpdate(payment.entityId, {
        status: "processing",
        paymentStatus: "paid",
        razorpayPaymentId: razorpay_payment_id,
        ...(delhiveryWaybill && { delhiveryWaybill, delhiveryStatus })
      });

      if (order) {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { totalSold: item.quantity, "inventory.stock": -item.quantity },
          });
        }
      }
      await Notification.create({
        userId: payment.userId,
        title: "Order Placed",
        message: "Your order payment is confirmed. We will process it shortly.",
        read: false,
      });
    } else if (payment.entityType === "astro") {
      await AstroRequest.findByIdAndUpdate(payment.entityId, {
        status: "paid",
        paymentStatus: "paid",
        razorpayPaymentId: razorpay_payment_id,
        $push: { statusHistory: { status: "paid", at: new Date() } },
      });
      await Notification.create({
        userId: payment.userId,
        title: "Consultation Confirmed",
        message: "Your astrology consultation payment is confirmed. Our astrologer will be assigned soon.",
        read: false,
      });
    }

    return NextResponse.json({
      success: true,
      entityType: payment.entityType,
      entityId: payment.entityId.toString(),
    });
  } catch (e) {
    logApiError("/api/payment/verify", "POST", e);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
