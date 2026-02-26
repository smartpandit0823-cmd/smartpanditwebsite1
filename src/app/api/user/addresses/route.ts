import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/jwt/user-session";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";

// GET /api/user/addresses — list all addresses
export async function GET() {
    const session = await getUserFromCookie();
    if (!session) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    await connectDB();
    const user = await User.findById(session.userId).select("addresses").lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ addresses: user.addresses || [] });
}

// POST /api/user/addresses — add new address
export async function POST(req: NextRequest) {
    const session = await getUserFromCookie();
    if (!session) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const body = await req.json();
    const { label, fullName, phone, line1, line2, area, city, state, pincode, lat, lng, isDefault } = body;

    if (!fullName || !phone || !line1 || !city || !state || !pincode) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    // If setting as default, unset others
    if (isDefault) {
        await User.findByIdAndUpdate(session.userId, {
            $set: { "addresses.$[].isDefault": false },
        });
    }

    const user = await User.findByIdAndUpdate(
        session.userId,
        {
            $push: {
                addresses: { label, fullName, phone, line1, line2, area, city, state, pincode, lat, lng, isDefault: isDefault || false },
            },
        },
        { new: true }
    ).select("addresses");

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true, addresses: user.addresses });
}

// PATCH /api/user/addresses — update address
export async function PATCH(req: NextRequest) {
    const session = await getUserFromCookie();
    if (!session) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const body = await req.json();
    const { addressId, ...updates } = body;

    if (!addressId) return NextResponse.json({ error: "addressId required" }, { status: 400 });

    await connectDB();

    // If setting as default, unset others
    if (updates.isDefault) {
        await User.findByIdAndUpdate(session.userId, {
            $set: { "addresses.$[].isDefault": false },
        });
    }

    const updateFields: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(updates)) {
        updateFields[`addresses.$.${key}`] = val;
    }

    const user = await User.findOneAndUpdate(
        { _id: session.userId, "addresses._id": addressId },
        { $set: updateFields },
        { new: true }
    ).select("addresses");

    if (!user) return NextResponse.json({ error: "Address not found" }, { status: 404 });

    return NextResponse.json({ success: true, addresses: user.addresses });
}

// DELETE /api/user/addresses — delete address
export async function DELETE(req: NextRequest) {
    const session = await getUserFromCookie();
    if (!session) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const addressId = searchParams.get("id");
    if (!addressId) return NextResponse.json({ error: "id required" }, { status: 400 });

    await connectDB();

    const user = await User.findByIdAndUpdate(
        session.userId,
        { $pull: { addresses: { _id: addressId } } },
        { new: true }
    ).select("addresses");

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true, addresses: user.addresses });
}
