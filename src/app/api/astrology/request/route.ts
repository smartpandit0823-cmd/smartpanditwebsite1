import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/jwt/user-session";
import connectDB from "@/lib/db/mongodb";
import AstroService from "@/models/AstroService";
import AstroRequest from "@/models/AstroRequest";
import Notification from "@/models/Notification";
import { logApiError } from "@/lib/api-logger";
import { z } from "zod";

const BodySchema = z.object({
  serviceType: z.string(),
  birthDate: z.string(),
  birthTime: z.string().optional(),
  birthPlace: z.string(),
  problemCategory: z.string(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  sessionType: z.number(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getUserFromCookie();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    await connectDB();

    const service = await AstroService.findOne({ _id: parsed.data.serviceType, active: true });
    if (!service) {
      const bySlug = await AstroService.findOne({ slug: parsed.data.serviceType, active: true });
      if (!bySlug) {
        return NextResponse.json({ error: "Service not found" }, { status: 404 });
      }
    }

    const svc = service || (await AstroService.findOne({ slug: parsed.data.serviceType }));
    const sessionType = svc?.sessionTypes?.find((t: { minutes: number }) => t.minutes === parsed.data.sessionType);
    const amount = sessionType?.price ?? 0;

    const astroReq = await AstroRequest.create({
      userId: session.userId,
      serviceType: parsed.data.serviceType,
      birthDate: new Date(parsed.data.birthDate),
      birthTime: parsed.data.birthTime,
      birthPlace: parsed.data.birthPlace,
      problemCategory: parsed.data.problemCategory,
      preferredDate: parsed.data.preferredDate ? new Date(parsed.data.preferredDate) : undefined,
      preferredTime: parsed.data.preferredTime,
      sessionType: parsed.data.sessionType,
      notes: parsed.data.notes,
      amount,
      status: "requested",
      paymentStatus: "pending",
      statusHistory: [{ status: "requested", at: new Date() }],
    });

    await Notification.create({
      userId: session.userId,
      title: "Consultation Requested",
      message: "Your astrology consultation is requested. Complete payment to confirm.",
      read: false,
    });

    return NextResponse.json({
      success: true,
      request: {
        id: astroReq._id.toString(),
        amount,
        status: "requested",
        paymentStatus: "pending",
      },
    });
  } catch (e) {
    logApiError("/api/astrology/request", "POST", e);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
