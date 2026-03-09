import { auth } from "@/auth";
import { ShippingClient } from "./ShippingClient";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";

export const metadata = {
    title: "Shipping Dashboard | Admin",
};

export default async function ShippingPage() {
    await auth();
    await connectDB();

    const shipments = await Order.find({
        $or: [
            { delhiveryWaybill: { $exists: true, $ne: "" } },
            { trackingId: { $exists: true, $ne: "" } }
        ]
    })
        .sort({ createdAt: -1 })
        .lean() as any[];

    const plainShipments = shipments.map(o => ({
        id: o._id.toString(),
        orderId: o.orderId || o._id.toString().slice(-8).toUpperCase(),
        waybill: o.delhiveryWaybill || o.trackingId,
        customerName: o.shippingAddress?.name || "Unknown",
        status: o.status,
        delhiveryStatus: o.delhiveryStatus || "Manifested / Ready",
        createdAt: o.createdAt?.toISOString() || new Date().toISOString(),
        totalAmount: o.totalAmount
    }));

    return <ShippingClient shipments={plainShipments} />;
}
