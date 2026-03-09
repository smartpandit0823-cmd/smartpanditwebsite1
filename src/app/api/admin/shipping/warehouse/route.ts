import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createWarehouse } from "@/lib/shipping/delhivery";

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();

        // Validate required fields
        if (!body.name || !body.address || !body.city || !body.pin || !body.state || !body.phone) {
            return NextResponse.json({ success: false, error: "All required fields must be filled" }, { status: 400 });
        }

        const result = await createWarehouse(body);

        if (!result.success) {
            return NextResponse.json({
                success: false,
                error: typeof result.error === "string" ? result.error : "Failed to register warehouse with Delhivery",
            }, { status: 400 });
        }

        return NextResponse.json({ success: true, data: result.data });
    } catch (error) {
        console.error("Warehouse creation error:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}
