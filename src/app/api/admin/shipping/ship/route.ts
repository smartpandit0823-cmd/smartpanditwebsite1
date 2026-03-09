import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";
import { createShipment, DelhiveryShipmentInput } from "@/lib/shipping/delhivery";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { orderId } = await req.json();
        if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });

        await connectDB();
        const order = await Order.findById(orderId).populate("items.productId") as any;
        if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

        // Don't ship if already shipped or has waybill
        if (order.delhiveryWaybill) {
            return NextResponse.json({
                error: "Order already shipped",
                waybill: order.delhiveryWaybill,
            }, { status: 409 });
        }

        // Prepare product description and dimensions
        const productDesc = order.items.map((i: any) => i.name).join(", ").slice(0, 100);
        let totalWeight = 0;
        let maxL = 10, maxB = 10, totalH = 0;

        for (const item of order.items) {
            const product = item.productId;
            const w = product?.shipping?.weight || product?.inventory?.weight ? parseFloat(product.shipping?.weight || product.inventory?.weight) : 50;
            totalWeight += (isNaN(w) ? 50 : w) * item.quantity;

            const l = parseFloat(product?.dimensions?.length) || 10;
            const b = parseFloat(product?.dimensions?.width) || 10;
            const h = parseFloat(product?.dimensions?.height) || 5;

            if (l > maxL) maxL = l;
            if (b > maxB) maxB = b;
            totalH += h * item.quantity;
        }

        const shipmentInput: DelhiveryShipmentInput = {
            orderId: order._id.toString(),
            customerName: order.shippingAddress.name,
            customerPhone: order.shippingAddress.phone,
            customerAddress: order.shippingAddress.address,
            customerCity: order.shippingAddress.city,
            customerState: order.shippingAddress.state,
            customerPincode: order.shippingAddress.pincode,
            paymentMode: order.paymentStatus === "paid" ? "Prepaid" : "COD",
            codAmount: order.paymentStatus === "paid" ? 0 : order.totalAmount,
            totalAmount: order.totalAmount,
            productDesc,
            weight: Math.max(totalWeight, 50), // min 50g
            length: maxL,
            breadth: maxB,
            height: Math.max(totalH, 5),
            quantity: order.items.reduce((sum: number, i: any) => sum + i.quantity, 0),
            sellerName: "SanatanSetu",
            sellerAddress: "Ganesh Nagar, Near Mahaviar Shala, Lasalgaon, Maharashtra 423401",
            sellerGstTin: "", // If you have GST later, add it here for tax invoices
        };

        const result = await createShipment(shipmentInput);

        if (result.success && result.waybill) {
            // Save waybill to order
            order.delhiveryWaybill = result.waybill;
            order.trackingId = result.waybill;
            order.delhiveryStatus = "Manifested";
            order.status = "processing";
            await order.save();

            return NextResponse.json({
                success: true,
                waybill: result.waybill,
                sortCode: result.sortCode,
                message: "Shipment created successfully!",
            });
        }

        return NextResponse.json({ success: false, error: result.error || "Failed to create shipment" }, { status: 400 });
    } catch (error) {
        console.error("Ship order error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
