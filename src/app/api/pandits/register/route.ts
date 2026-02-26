import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Pandit from "@/models/Pandit";

// POST /api/pandits/register — Public pandit/astrologer registration
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        const {
            name, email, phone, photo, dateOfBirth,
            address, city, state, pincode, lat, lng,
            experience, specializations, providesAstrology,
            certifications
        } = body;

        // Validate required
        if (!name || !email || !phone || !city || !state) {
            return NextResponse.json(
                { success: false, error: "Name, email, phone, city, and state are required." },
                { status: 400 }
            );
        }

        // Check duplicate email
        const existing = await Pandit.findOne({ email: email.toLowerCase() });
        if (existing) {
            return NextResponse.json(
                { success: false, error: "A pandit with this email already exists." },
                { status: 409 }
            );
        }

        const pandit = await Pandit.create({
            name,
            email: email.toLowerCase(),
            phone,
            photo: photo || "",
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
            address,
            city,
            state,
            pincode,
            lat: lat ? Number(lat) : undefined,
            lng: lng ? Number(lng) : undefined,
            experience: Number(experience) || 0,
            specializations: specializations || [],
            providesAstrology: providesAstrology || false,
            certifications: certifications || [],
            verificationStatus: "pending",
            status: "active",
        });

        return NextResponse.json(
            {
                success: true,
                data: { id: pandit._id },
                message: "Application submitted successfully! Our team will contact you within 24 hours.",
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Pandit registration error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
