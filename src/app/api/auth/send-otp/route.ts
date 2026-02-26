import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db/mongodb";
import Otp from "@/models/Otp";
import { sendOtpViaMsg91, sendOtpFallback, getOtpExpiryMinutes } from "@/lib/otp/msg91";
import { logApiError } from "@/lib/api-logger";
import { z } from "zod";

const BodySchema = z.object({ phone: z.string().min(10, "Valid phone required") });

const MAX_ATTEMPTS = 5;
const OTP_LENGTH = 6;

function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid phone", details: parsed.error.flatten() }, { status: 400 });
    }

    const phone = parsed.data.phone.replace(/\D/g, "");
    if (phone.length < 10) {
      return NextResponse.json({ error: "Valid 10-digit phone required" }, { status: 400 });
    }

    await connectDB();

    const existing = await Otp.findOne({ phone }).sort({ createdAt: -1 });
    if (existing && existing.attempts >= MAX_ATTEMPTS) {
      return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + getOtpExpiryMinutes() * 60 * 1000);

    await Otp.create({ phone, otpHash, expiresAt, attempts: 0 });

    const sent = await sendOtpViaMsg91(phone, otp);
    if (!sent) await sendOtpFallback(phone, otp);

    return NextResponse.json({
      success: true,
      message: "OTP sent",
      expiresIn: getOtpExpiryMinutes() * 60,
      ...(process.env.NODE_ENV !== "production" && { devOtp: otp }),
    });
  } catch (e) {
    logApiError("/api/auth/send-otp", "POST", e);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
