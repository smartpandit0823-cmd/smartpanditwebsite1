import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Pandit from "@/models/Pandit";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const data = await req.json();
        await connectDB();

        const pandit = await Pandit.findByIdAndUpdate(id, data, { new: true });
        if (!pandit) {
            return NextResponse.json({ error: "Pandit not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, pandit });
    } catch (error) {
        console.error("Error updating pandit:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
