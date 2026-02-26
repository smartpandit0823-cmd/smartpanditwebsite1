import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectDB();

    const body = await req.json();
    const { status, trackingId } = body;

    try {
        const order = await Order.findById(id);
        if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

        const previousStatus = order.status;
        order.status = status;

        // If tracking ID provided, store it
        if (trackingId) {
            // Store tracking in order metadata
            (order as unknown as Record<string, unknown>).trackingId = trackingId;
        }

        // Auto-reduce stock when order moves to processing (only once)
        if (status === "processing" && previousStatus !== "processing") {
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.productId, {
                    $inc: { "inventory.stock": -item.quantity },
                });
            }
        }

        await order.save();
        return NextResponse.json({ success: true, order });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
