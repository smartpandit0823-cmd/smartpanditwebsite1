import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";
import Notification from "@/models/Notification";

/**
 * Delhivery Webhook Handler
 * Handles all status types from the Delhivery B2C API:
 * 
 * Forward Shipment:
 *   UD - Manifested, Not Picked, In Transit, Pending, Dispatched
 *   DL - Delivered
 * 
 * Return Shipment:
 *   RT - In Transit, Pending, Dispatched
 *   DL - RTO
 * 
 * Reverse Shipment:
 *   PP - Open, Scheduled, Dispatched
 *   PU - In Transit, Pending, Dispatched
 *   DL - DTO
 * 
 * Cancellation:
 *   CN - Canceled, Closed
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        await connectDB();

        const processShipment = async (shipmentData: any) => {
            if (!shipmentData) return;

            const waybill = shipmentData.AWB;
            const statusObj = shipmentData.Status;
            if (!waybill || !statusObj) return;

            const statusCode = statusObj.StatusCode;   // UD, DL, RT, PP, PU, CN
            const statusType = statusObj.StatusType;    // UD, DL, RT, PP, PU, CN (alternate key)
            const statusString = statusObj.Status;      // Manifested, In Transit, Delivered, etc.
            const scanType = statusCode || statusType;

            const order = await Order.findOne({ delhiveryWaybill: waybill });
            if (!order) {
                console.log(`[Webhook] Order not found for AWB ${waybill}`);
                return;
            }

            // Map Delhivery status to our internal status
            let newInternalStatus = order.status;
            let notificationMessage = "";

            const ordShort = order._id.toString().slice(-8).toUpperCase();

            // ─── Forward Shipment (UD) ─────────────────────────
            if (scanType === "UD") {
                if (statusString === "Manifested") {
                    newInternalStatus = "processing";
                } else if (statusString === "Not Picked") {
                    newInternalStatus = "processing";
                    notificationMessage = `Order #${ordShort}: Pickup attempt was unsuccessful. We'll retry soon.`;
                } else if (statusString === "In Transit") {
                    newInternalStatus = "shipped";
                    notificationMessage = `Great news! Order #${ordShort} is on its way to you!`;
                } else if (statusString === "Pending") {
                    newInternalStatus = "shipped";
                    notificationMessage = `Order #${ordShort} has reached your city. Delivery is coming soon!`;
                } else if (statusString === "Dispatched") {
                    newInternalStatus = "shipped";
                    notificationMessage = `Order #${ordShort} is out for delivery today!`;
                }
            }

            // ─── Delivered (DL) ────────────────────────────────
            if (scanType === "DL") {
                if (statusString === "Delivered") {
                    newInternalStatus = "delivered";
                    notificationMessage = `Your order #${ordShort} has been delivered successfully! 🎉`;
                } else if (statusString === "RTO") {
                    newInternalStatus = "cancelled";
                    notificationMessage = `Order #${ordShort} has been returned to origin. Please contact support.`;
                } else if (statusString === "DTO") {
                    // Reverse shipment delivered to origin
                    newInternalStatus = "delivered";
                    notificationMessage = `Return shipment #${ordShort} has been received.`;
                }
            }

            // ─── Return Flow (RT) ──────────────────────────────
            if (scanType === "RT") {
                if (statusString === "In Transit") {
                    notificationMessage = `Order #${ordShort} delivery was unsuccessful. Package is being returned.`;
                } else if (statusString === "Dispatched") {
                    notificationMessage = `Return shipment #${ordShort} is dispatched for return delivery.`;
                }
                // Don't change internal status for RT intermediate steps
            }

            // ─── Cancellation (CN) ─────────────────────────────
            if (scanType === "CN") {
                newInternalStatus = "cancelled";
                notificationMessage = `Order #${ordShort} shipment has been cancelled.`;
            }

            // Update Order in DB
            order.delhiveryStatus = statusString;

            let statusChanged = false;
            if (order.status !== newInternalStatus) {
                order.status = newInternalStatus as any;
                statusChanged = true;
            }

            await order.save();

            // Push notification to user on significant status changes
            if (statusChanged || notificationMessage) {
                const msg = notificationMessage || `Order #${ordShort} status updated to: ${statusString}`;
                try {
                    await Notification.create({
                        userId: order.userId,
                        title: `Order ${statusString}`,
                        message: msg,
                        read: false,
                    });
                } catch (e) {
                    console.error("[Webhook] Notification creation failed:", e);
                }
            }

            console.log(`[Webhook] AWB ${waybill}: ${statusString} (${scanType}) → Internal: ${newInternalStatus}`);
        };

        // Delhivery may send array of updates or single object
        if (Array.isArray(body)) {
            for (const item of body) {
                await processShipment(item?.Shipment);
            }
        } else if (body?.Shipment) {
            await processShipment(body.Shipment);
        }

        return NextResponse.json({ success: true, message: "Webhook processed" });

    } catch (error) {
        console.error("Delhivery Webhook Error:", error);
        return NextResponse.json({ success: false, error: "Internal Error" }, { status: 500 });
    }
}
