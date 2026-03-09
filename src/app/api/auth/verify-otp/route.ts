import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import { createUserSession, setUserCookie } from "@/lib/jwt/user-session";
import { logApiError } from "@/lib/api-logger";
import { z } from "zod";
import { authAdmin } from "@/lib/firebase/admin";

const BodySchema = z.object({
  token: z.string(),
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    const { token, name, email, city, googleData } = parsed.data;

    let decodedToken;
    try {
      decodedToken = await authAdmin.verifyIdToken(token);
    } catch (e) {
      logApiError("/api/auth/verify-otp", "POST", e);
      return NextResponse.json({ error: "Invalid or expired Firebase token" }, { status: 401 });
    }

    const phoneStr = decodedToken.phone_number;
    if (!phoneStr) {
      return NextResponse.json({ error: "Phone number not found in token" }, { status: 400 });
    }

    const cleanPhone = phoneStr.replace(/\D/g, ""); // Keep only digits

    await connectDB();

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

    const sessionToken = await createUserSession(user._id.toString(), cleanPhone);
    await setUserCookie(sessionToken);

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
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
  }
}
