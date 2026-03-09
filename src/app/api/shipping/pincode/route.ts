import { NextRequest, NextResponse } from "next/server";
import { checkPincode } from "@/lib/shipping/delhivery";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const pincode = searchParams.get("pincode");
    const weight = searchParams.get("weight") ? parseInt(searchParams.get("weight") as string, 10) : 500;

    if (!pincode || pincode.length !== 6) {
        return NextResponse.json({ error: "Valid 6-digit pincode required" }, { status: 400 });
    }

    const result = await checkPincode(pincode, weight);
    return NextResponse.json(result);
}
