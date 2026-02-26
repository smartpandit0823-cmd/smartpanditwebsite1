import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import TeamMember from "@/models/TeamMember";

// GET - single member
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectDB();
    const member = await TeamMember.findById(id).lean();
    if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(member);
}

// PUT - update member
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectDB();
    const body = await req.json();

    try {
        const member = await TeamMember.findByIdAndUpdate(id, body, { new: true });
        if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(member);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}

// DELETE - soft delete
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectDB();
    const member = await TeamMember.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
    if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
}
