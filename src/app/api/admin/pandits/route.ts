import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Pandit from "@/models/Pandit";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectDB();
        const pandits = await Pandit.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json({ success: true, data: pandits });
    } catch (error) {
        console.error("Error fetching pandits:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        await connectDB();

        const pandit = await Pandit.create({
            ...data,
            joinedAt: new Date(),
        });

        return NextResponse.json({ success: true, pandit });
    } catch (error) {
        console.error("Error creating pandit:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
