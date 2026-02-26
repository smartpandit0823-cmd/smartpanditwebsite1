import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Slider from "@/models/Slider";
import { z } from "zod";

const UpdateSchema = z.object({
  title: z.string().min(1).optional(),
  image: z.string().optional(),
  link: z.string().optional(),
  order: z.number().optional(),
  active: z.boolean().optional(),
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
    const slider = await Slider.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!slider) return NextResponse.json({ error: "Slider not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update slider" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectDB();
    const slider = await Slider.findByIdAndDelete(id);
    if (!slider) return NextResponse.json({ error: "Slider not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete slider" }, { status: 500 });
  }
}
