import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// POST /api/upload/pandit — Public upload for pandit registration (photo + certificates)
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const folder = (formData.get("folder") as string) || "pandits";

        if (!file) {
            return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ success: false, error: "File too large. Max 5MB." }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ success: false, error: "Only JPG, PNG, WebP, and PDF files are allowed." }, { status: 400 });
        }

        // Create upload directory
        const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
        await mkdir(uploadDir, { recursive: true });

        // Generate unique filename
        const ext = file.name.split(".").pop() || "jpg";
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
        const filePath = path.join(uploadDir, uniqueName);

        // Write file
        const bytes = await file.arrayBuffer();
        await writeFile(filePath, Buffer.from(bytes));

        const publicUrl = `/uploads/${folder}/${uniqueName}`;

        return NextResponse.json({
            success: true,
            url: publicUrl,
            fileName: uniqueName,
        });
    } catch (error: any) {
        console.error("File upload error:", error);
        return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
    }
}
