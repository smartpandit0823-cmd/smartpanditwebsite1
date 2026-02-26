import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import PujaRequest from "@/models/PujaRequest";
import mongoose from "mongoose";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { status, amount, assignedPanditId, adminNotes } = await req.json();

        await connectDB();

        const request = await PujaRequest.findById(id);
        if (!request) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        // Only update allowed fields
        if (status) request.status = status;
        if (typeof amount === "number") request.amount = amount;

        // Explicit null handles un-assigning
        if (assignedPanditId === null) {
            request.assignedPanditId = undefined;
        } else if (assignedPanditId) {
            request.assignedPanditId = new mongoose.Types.ObjectId(assignedPanditId);
        }

        if (adminNotes !== undefined) request.adminNotes = adminNotes;

        // Track status history if changed
        if (request.isModified("status")) {
            request.statusHistory.push({
                status: request.status,
                changedAt: new Date(),
                changedBy: session.user.email || "admin",
            });
        }

        await request.save();

        return NextResponse.json({ success: true, request });
    } catch (error) {
        console.error("Error updating puja request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
