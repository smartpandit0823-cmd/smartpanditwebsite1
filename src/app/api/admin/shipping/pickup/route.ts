import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createPickupRequest } from "@/lib/shipping/delhivery";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        let { pickupDate, expectedPackageCount, pickupTime } = body;

        if (!expectedPackageCount) {
            expectedPackageCount = 1;
        }

        // Default to tomorrow if no date provided
        if (!pickupDate) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            pickupDate = tomorrow.toISOString().split("T")[0]; // YYYY-MM-DD
        }

        if (!pickupTime) {
            pickupTime = "12:00:00";
        }

        console.log("[Pickup] Scheduling pickup:", { pickupDate, pickupTime, expectedPackageCount });

        const result = await createPickupRequest(pickupDate, expectedPackageCount);

        console.log("[Pickup] Delhivery response:", JSON.stringify(result));

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: `Pickup scheduled for ${pickupDate}`,
                data: result.data
            });
        }

        // Return detailed error from Delhivery
        const errorMsg = typeof result.error === "object"
            ? JSON.stringify(result.error)
            : result.error || "Failed to schedule pickup";

        const delhiveryData = result.data;

        return NextResponse.json({
            success: false,
            error: errorMsg,
            details: delhiveryData,
        }, { status: 400 });
    } catch (error) {
        console.error("Schedule pickup error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
