import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/jwt/user-session";
import connectDB from "@/lib/db/mongodb";
import AstroRequest from "@/models/AstroRequest";

function getStatusMessage(status: string, finalCallTime?: Date, assignedAstrologer?: { name: string }): string {
  switch (status) {
    case "requested":
      return "Your consultation is requested. Complete payment to confirm.";
    case "paid":
      return "Your booking is confirmed. Our team will assign an astrologer soon.";
    case "assigned":
      return assignedAstrologer
        ? `Pandit ${assignedAstrologer.name} has been assigned. We will confirm your call time shortly.`
        : "An astrologer has been assigned. Call time will be confirmed soon.";
    case "confirmed":
      return finalCallTime
        ? `Your call is scheduled for ${finalCallTime.toLocaleString("en-IN")}.`
        : "Your call has been scheduled.";
    case "completed":
      return "Your consultation is completed. Thank you.";
    case "cancelled":
      return "This consultation was cancelled.";
    default:
      return "Processing your request.";
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getUserFromCookie();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const req = await AstroRequest.findOne({ _id: id, userId: session.userId })
      .populate("assignedAstrologerId", "name phone")
      .lean();

    if (!req) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const astrologerValue = req.assignedAstrologerId;
    const astrologer =
      astrologerValue &&
      typeof astrologerValue === "object" &&
      "name" in astrologerValue &&
      "phone" in astrologerValue
        ? {
            name: String(astrologerValue.name),
            phone: String(astrologerValue.phone),
          }
        : null;

    return NextResponse.json({
      id: req._id.toString(),
      serviceType: req.serviceType,
      birthDate: req.birthDate,
      birthPlace: req.birthPlace,
      problemCategory: req.problemCategory,
      preferredDate: req.preferredDate,
      preferredTime: req.preferredTime,
      sessionType: req.sessionType,
      status: req.status,
      paymentStatus: req.paymentStatus,
      amount: req.amount,
      finalCallTime: req.finalCallTime,
      assignedAstrologer: astrologer,
      statusMessage: getStatusMessage(req.status, req.finalCallTime, astrologer ?? undefined),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch request" }, { status: 500 });
  }
}
