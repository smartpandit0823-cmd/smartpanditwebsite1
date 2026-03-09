import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";
import { cancelShipment } from "@/lib/shipping/delhivery";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { orderId, waybill } = await req.json();

        if (!orderId || !waybill) {
            return NextResponse.json({ error: "orderId and waybill are required" }, { status: 400 });
        }

        const result = await cancelShipment(waybill);

        if (result.success) {
            await connectDB();
            const order = await Order.findById(orderId);

            if (order) {
                order.delhiveryWaybill = undefined;
                order.trackingId = undefined;
                order.delhiveryStatus = "Cancelled";
                // Only revert to processing if it was previously processed by Delhivery
                if (order.status === "processing" || order.status === "shipped") {
                    order.status = "processing";
                }
                await order.save();
            }

            return NextResponse.json({
                success: true,
                message: "Shipment cancelled successfully",
            });
        }

        return NextResponse.json({ success: false, error: result.error || "Failed to cancel shipment" }, { status: 400 });
    } catch (error) {
        console.error("Cancel shipment error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
