import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Banner from "@/models/Banner";
import { z } from "zod";

const CreateSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  image: z.string().min(1),
  mobileImage: z.string().optional(),
  link: z.string().optional(),
  position: z.enum(["home", "puja", "store", "astrology"]),
  status: z.enum(["active", "inactive"]).optional(),
  order: z.number().optional(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const parsed = CreateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    await connectDB();
    const banner = await Banner.create({
      ...parsed.data,
      status: parsed.data.status ?? "active",
      order: parsed.data.order ?? 0,
      startsAt: parsed.data.startsAt ? new Date(parsed.data.startsAt) : undefined,
      endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : undefined,
    });

    return NextResponse.json({ success: true, id: banner._id.toString() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}
