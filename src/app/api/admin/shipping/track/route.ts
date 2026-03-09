import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";
import { trackShipment, mapDelhiveryStatusToOrderStatus } from "@/lib/shipping/delhivery";

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const waybill = searchParams.get("waybill");
    const orderId = searchParams.get("orderId");

    try {
        await connectDB();

        let trackingWaybill = waybill;

        // If orderId provided, fetch waybill from order
        if (!trackingWaybill && orderId) {
            const order = await Order.findById(orderId).lean() as any;
            trackingWaybill = order?.delhiveryWaybill || order?.trackingId;
        }

        if (!trackingWaybill) {
            return NextResponse.json({ error: "No waybill found" }, { status: 400 });
        }

        const tracking = await trackShipment(trackingWaybill);

        // Update order status based on Delhivery status
        if (tracking.success && orderId) {
            const mappedStatus = mapDelhiveryStatusToOrderStatus(tracking.currentStatus);
            await Order.findByIdAndUpdate(orderId, {
                delhiveryStatus: tracking.currentStatus,
                status: mappedStatus,
            });
        }

        return NextResponse.json(tracking);
    } catch (error) {
        console.error("Track error:", error);
        return NextResponse.json({ error: "Failed to track" }, { status: 500 });
    }
}
