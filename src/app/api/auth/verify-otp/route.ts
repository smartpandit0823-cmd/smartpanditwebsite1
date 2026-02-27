import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { createUserSession, setUserCookie } from "@/lib/jwt/user-session";
import { logApiError } from "@/lib/api-logger";
import { z } from "zod";

const BodySchema = z.object({
  phone: z.string().min(10),
  otp: z.string().length(6),
  name: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  city: z.string().optional(),
  googleData: z.object({
    googleId: z.string(),
    name: z.string().optional(),
    email: z.string().optional(),
    avatar: z.string().optional(),
  }).optional()
});

function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    const { phone, otp, name, email, city, googleData } = parsed.data;
    const cleanPhone = phone.replace(/\D/g, "");
    const otpHash = hashOtp(otp);

    await connectDB();

    const otpRecord = await Otp.findOne({ phone: cleanPhone }).sort({ createdAt: -1 });
    if (!otpRecord) {
      return NextResponse.json({ error: "OTP expired or invalid" }, { status: 400 });
    }
    if (otpRecord.expiresAt < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }
    if (otpRecord.otpHash !== otpHash) {
      await Otp.findByIdAndUpdate(otpRecord._id, { $inc: { attempts: 1 } });
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }
    if (otpRecord.attempts >= 5) {
      return NextResponse.json({ error: "Too many failed attempts" }, { status: 429 });
    }

    let user = await User.findOne({ phone: cleanPhone });
    if (!user) {
      user = await User.create({
        phone: cleanPhone,
        name: name || googleData?.name || undefined,
        email: email || googleData?.email || undefined,
        city: city || undefined,
        googleId: googleData?.googleId || undefined,
        avatar: googleData?.avatar || undefined,
        authProvider: googleData ? "google" : "phone",
      });
    } else {
      // User exists, merge new data if provided
      await User.findByIdAndUpdate(user._id, {
        ...((name || googleData?.name) && !user.name && { name: name || googleData?.name }),
        ...((email || googleData?.email) && { email: email || googleData?.email }),
        ...(city && { city }),
        ...(googleData?.googleId && { googleId: googleData.googleId, authProvider: "google" }),
        ...(googleData?.avatar && !user.avatar && { avatar: googleData.avatar }),
      });
    }

    await Otp.findByIdAndDelete(otpRecord._id);

    const token = await createUserSession(user._id.toString(), cleanPhone);
    await setUserCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        phone: user.phone,
        name: user.name,
        email: user.email,
        city: user.city,
      },
    });
  } catch (e) {
    logApiError("/api/auth/verify-otp", "POST", e);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
