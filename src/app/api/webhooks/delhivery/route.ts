import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";
import { mapDelhiveryStatusToOrderStatus } from "@/lib/shipping/delhivery";

// Handle incoming Delhivery webhooks for real-time tracking updates
export async function POST(req: NextRequest) {
    try {
        const payload = await req.json();

        // Delhivery webhook payload format usually contains Waybill and Status
        const waybill = payload?.Waybill || payload?.awb || payload?.waybill;
        const statusType = payload?.Status?.Status || payload?.status || payload?.current_status;

        if (!waybill || !statusType) {
            return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
        }

        await connectDB();

        // Find the order that has this waybill
        const order = await Order.findOne({ delhiveryWaybill: waybill });
        if (!order) {
            return NextResponse.json({ success: false, error: "Order not found for waybill" }, { status: 404 });
        }

        // Map Delhivery status to our system's status
        const ourStatus = mapDelhiveryStatusToOrderStatus(statusType);

        // Update the order
        let updated = false;
        if (order.delhiveryStatus !== statusType) {
            order.delhiveryStatus = statusType;
            updated = true;
        }

        // Only move order status forward using webhook data (e.g., processing -> shipped -> delivered)
        // Ensure manual overrides aren't fully overwritten if not intended, but standard flow works
        if (order.status !== "delivered" && order.status !== "cancelled" && ourStatus !== order.status) {
            order.status = ourStatus as any;
            updated = true;
        }

        if (updated) {
            await order.save();
        }

        return NextResponse.json({ success: true, message: "Webhook processed" });
    } catch (error) {
        console.error("Delhivery webhook error:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
