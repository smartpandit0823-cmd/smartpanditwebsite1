import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { generatePresignedUploadUrl } from "@/lib/s3/upload";
import { z } from "zod";

const BodySchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  folder: z.enum(["pujas", "products", "pandits", "blogs", "banners", "offers", "sliders", "astrology", "testimonials", "misc"]).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
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
      parsed.data.folder ?? "misc"
    );

    return NextResponse.json({ uploadUrl, key, publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
