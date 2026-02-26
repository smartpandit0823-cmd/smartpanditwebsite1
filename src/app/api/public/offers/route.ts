import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Offer from "@/models/Offer";

export async function GET() {
    try {
        await connectDB();
        const currentDate = new Date();
        // active, and either no start/end date (null or missing) or current date within range
        const offers = await Offer.find({
            active: true,
            $and: [
                { $or: [{ startDate: { $exists: false } }, { startDate: null }, { startDate: { $lte: currentDate } }] },
                { $or: [{ endDate: { $exists: false } }, { endDate: null }, { endDate: { $gte: currentDate } }] }
            ]
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        return NextResponse.json({ success: true, data: offers });
    } catch (error) {
        console.error("Error fetching public offers:", error);
        return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
    }
}
