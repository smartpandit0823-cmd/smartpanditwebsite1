import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Offer from "@/models/Offer";
import { z } from "zod";

const CreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
  type: z.enum(["puja", "store", "astrology", "temple", "global"]),
  targetId: z.string().optional(),
  targetSlug: z.string().optional(),
  discount: z.number().min(0),
  discountType: z.enum(["flat", "percent"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
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
    const offer = await Offer.create({
      ...parsed.data,
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : undefined,
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : undefined,
      active: parsed.data.active ?? true,
    });

    return NextResponse.json({ success: true, id: offer._id.toString() });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create offer" }, { status: 500 });
  }
}
