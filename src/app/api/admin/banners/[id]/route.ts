import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Banner from "@/models/Banner";
import { z } from "zod";

const UpdateSchema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().optional(),
  image: z.string().optional(),
  mobileImage: z.string().optional(),
  link: z.string().optional(),
  position: z.enum(["home", "puja", "store", "astrology"]).optional(),
  status: z.enum(["active", "inactive"]).optional(),
  order: z.number().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const parsed = UpdateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    await connectDB();
    const update: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.startsAt !== undefined) update.startsAt = parsed.data.startsAt ? new Date(parsed.data.startsAt) : null;
    if (parsed.data.endsAt !== undefined) update.endsAt = parsed.data.endsAt ? new Date(parsed.data.endsAt) : null;

    const banner = await Banner.findByIdAndUpdate(id, update, { new: true });
    if (!banner) return NextResponse.json({ error: "Banner not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectDB();
    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) return NextResponse.json({ error: "Banner not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}
