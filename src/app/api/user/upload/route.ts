import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/jwt/user-session";
import { generatePresignedUploadUrl } from "@/lib/s3/upload";
import { z } from "zod";
import { logApiError } from "@/lib/api-logger";

const BodySchema = z.object({
    fileName: z.string().min(1),
    contentType: z.string().min(1),
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
            return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 });
        }

        const { uploadUrl, key, publicUrl } = await generatePresignedUploadUrl(
            parsed.data.fileName,
            parsed.data.contentType,
            "misc"
        );

        return NextResponse.json({ uploadUrl, key, publicUrl });
    } catch (error) {
        logApiError("/api/user/upload", "POST", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
