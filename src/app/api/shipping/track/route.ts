import { NextRequest, NextResponse } from "next/server";
import { trackShipment, mapDelhiveryStatusToOrderStatus } from "@/lib/shipping/delhivery";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const waybill = searchParams.get("waybill");

    if (!waybill) {
        return NextResponse.json({ error: "waybill required" }, { status: 400 });
    }

    try {
        const tracking = await trackShipment(waybill);

        if (tracking.success && tracking.currentStatus) {
            await connectDB();
            const mappedStatus = mapDelhiveryStatusToOrderStatus(tracking.currentStatus);
            // Auto sync DB status with Delhivery
            await Order.findOneAndUpdate(
                { delhiveryWaybill: waybill },
                {
                    delhiveryStatus: tracking.currentStatus,
                    status: mappedStatus
                }
            );
        }

        return NextResponse.json(tracking);
    } catch (e) {
        return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
    }
}
