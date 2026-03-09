import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db/mongodb";
import Otp from "@/models/Otp";
import User from "@/models/User";
import { createUserSession, setUserCookie } from "@/lib/jwt/user-session";
import { logApiError } from "@/lib/api-logger";
import { z } from "zod";

const BodySchema = z.object({
    phone: z.string().min(10),
    otp: z.string().length(6),
});

function hashOtp(otp: string): string {
    return crypto.createHash("sha256").update(otp).digest("hex");
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = BodySchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const phone = parsed.data.phone.replace(/\D/g, "");
        const otpHash = hashOtp(parsed.data.otp);

        await connectDB();

        // Find the latest unexpired OTP for this phone
        const otpDoc = await Otp.findOne({
            phone,
            otpHash,
            expiresAt: { $gt: new Date() },
        }).sort({ createdAt: -1 });

        if (!otpDoc) {
            // Increment attempts on latest OTP
            await Otp.findOneAndUpdate(
                { phone },
                { $inc: { attempts: 1 } },
                { sort: { createdAt: -1 } }
            );
            return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
        }

        // OTP is valid — delete used OTPs
        await Otp.deleteMany({ phone });

        // Find or create user
        let user = await User.findOne({ phone });
        const isNewUser = !user;

        if (!user) {
            user = await User.create({
                phone,
                authProvider: "phone",
            });
        }

        // Create session
        const sessionToken = await createUserSession(user._id.toString(), phone);
        await setUserCookie(sessionToken);

        return NextResponse.json({
            success: true,
            isNewUser,
            user: {
                id: user._id.toString(),
                phone: user.phone,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                city: user.city,
            },
        });
    } catch (e) {
        logApiError("/api/auth/login", "POST", e);
        return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
    }
}
