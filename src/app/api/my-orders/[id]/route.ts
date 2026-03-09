import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/jwt/user-session";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getUserFromCookie();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await connectDB();

        const order = await Order.findOne({ _id: id, userId: session.userId }).lean() as any;
        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            order: {
                id: order._id.toString(),
                totalAmount: order.totalAmount,
                shippingFee: order.shippingFee || 0,
                status: order.status,
                paymentStatus: order.paymentStatus,
                razorpayPaymentId: order.razorpayPaymentId || null,
                trackingId: order.trackingId || order.delhiveryWaybill || null,
                delhiveryWaybill: order.delhiveryWaybill || null,
                delhiveryStatus: order.delhiveryStatus || null,
                items: (order.items || []).map((item: any) => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image || "",
                    productId: item.productId?.toString() || "",
                })),
                shippingAddress: order.shippingAddress || null,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
            },
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
    }
}
