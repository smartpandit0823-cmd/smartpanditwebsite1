import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ReviewRepository } from "@/repositories/review.repository";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user?.id || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { status } = await req.json();

        if (!["pending", "approved", "rejected"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const repo = new ReviewRepository();
        const updated = await repo.updateById(id, { status });

        if (!updated) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updated });
    } catch (error) {
        console.error("Update review error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
