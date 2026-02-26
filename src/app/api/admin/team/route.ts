import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import TeamMember from "@/models/TeamMember";

// GET - List team members  
// POST - Create team member
export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const status = searchParams.get("status");

    const filter: Record<string, unknown> = { deletedAt: { $exists: false } };
    if (role && role !== "all") filter.role = role;
    if (status && status !== "all") filter.status = status;

    const members = await TeamMember.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const body = await req.json();

    try {
        const member = await TeamMember.create(body);
        return NextResponse.json(member, { status: 201 });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
