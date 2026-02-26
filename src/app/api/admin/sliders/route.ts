import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Slider from "@/models/Slider";
import { z } from "zod";

const CreateSchema = z.object({
  title: z.string().min(1),
  image: z.string().min(1),
  link: z.string().optional(),
  order: z.number().optional(),
  active: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = CreateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    await connectDB();
    const slider = await Slider.create({
      ...parsed.data,
      order: parsed.data.order ?? 0,
      active: parsed.data.active ?? true,
    });

    return NextResponse.json({ success: true, id: slider._id.toString() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create slider" }, { status: 500 });
  }
}
