import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import { createUserSession, setUserCookie } from "@/lib/jwt/user-session";
import { logApiError } from "@/lib/api-logger";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: NextRequest) {
    try {
        const { credential } = await req.json();
        if (!credential) {
            return NextResponse.json({ error: "Missing credential" }, { status: 400 });
        }

        // Verify Google token
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return NextResponse.json({ error: "Invalid Google token" }, { status: 400 });
        }

        const { sub: googleId, email, name, picture } = payload;

        await connectDB();

        // Find by googleId first, then by email
        let user = await User.findOne({ $or: [{ googleId }, { email }] });

        if (!user) {
            // New user from Google, we need their phone number to proceed
            return NextResponse.json({
                success: true,
                requirePhone: true,
                googleData: {
                    googleId,
                    email,
                    name: name || email?.split("@")[0],
                    avatar: picture,
                },
            });
        }

        // Link google account if not already linked
        if (!user.googleId) {
            user.googleId = googleId;
            user.authProvider = "google";
        }
        if (!user.avatar && picture) user.avatar = picture;
        if (!user.name && name) user.name = name;
        if (!user.email && email) user.email = email;
        await user.save();

        const token = await createUserSession(user._id.toString(), user.phone);
        await setUserCookie(token);

        return NextResponse.json({
            success: true,
            user: {
                id: user._id.toString(),
                phone: user.phone,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                city: user.city,
            },
            isNewUser: false,
        });
    } catch (e) {
        logApiError("/api/auth/google", "POST", e);
        return NextResponse.json({ error: "Google login failed" }, { status: 500 });
    }
}
