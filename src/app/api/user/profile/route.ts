import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/jwt/user-session";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import Booking from "@/models/Booking";
import Order from "@/models/Order";

// GET /api/user/profile — full profile
export async function GET() {
    const session = await getUserFromCookie();
    if (!session) {
        return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.userId)
        .select("-__v")
        .lean();

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Dynamically calculate real-time stats
    const [totalBookings, totalOrders, bookingsSpentData, ordersSpentData] = await Promise.all([
        Booking.countDocuments({ userId: session.userId, status: { $ne: "cancelled" }, amountPaid: { $gt: 0 } }),
        Order.countDocuments({ userId: session.userId, status: { $ne: "cancelled" }, paymentStatus: "paid" }),
        Booking.aggregate([
            { $match: { userId: user._id, status: { $ne: "cancelled" }, amountPaid: { $gt: 0 } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]),
        Order.aggregate([
            { $match: { userId: user._id, paymentStatus: "paid" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ])
    ]);

    const bookingsSpent = bookingsSpentData[0]?.total || 0;
    const ordersSpent = ordersSpentData[0]?.total || 0;
    const realTotalSpent = bookingsSpent + ordersSpent;

    return NextResponse.json({
        user: {
            id: user._id.toString(),
            phone: user.phone,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            city: user.city,
            dateOfBirth: user.dateOfBirth,
            birthTime: user.birthTime,
            birthPlace: user.birthPlace,
            gotra: user.gotra,
            gender: user.gender,
            language: user.language,
            addresses: user.addresses || [],
            totalBookings: totalBookings,
            totalOrders: totalOrders,
            totalSpent: realTotalSpent,
            createdAt: user.createdAt,
        },
    });
}

// PATCH /api/user/profile — update profile
export async function PATCH(req: NextRequest) {
    const session = await getUserFromCookie();
    if (!session) {
        return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const body = await req.json();

    // Only allow specific fields
    const allowedFields = [
        "name", "email", "avatar", "city",
        "dateOfBirth", "birthTime", "birthPlace", "gotra", "gender", "language",
    ];

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
        if (body[field] !== undefined) {
            updates[field] = body[field];
        }
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(session.userId, updates, { new: true })
        .select("-__v")
        .lean();

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
        success: true,
        user: {
            id: user._id.toString(),
            phone: user.phone,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            city: user.city,
        },
    });
}
