import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const DELHIVERY_TOKEN = process.env.DELHIVERY_API_TOKEN || "";
const BASE_URL = process.env.DELHIVERY_BASE_URL || "https://track.delhivery.com";

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const waybill = searchParams.get("waybill");
    const pdfSize = searchParams.get("pdf_size") || "4x6"; // Changed from A4 to 4x6 for professional shipping label format

    if (!waybill) {
        return NextResponse.json({ error: "waybill required" }, { status: 400 });
    }

    try {
        // Fetch the PDF directly from Delhivery and proxy it to the browser
        const labelUrl = `${BASE_URL}/api/p/packing_slip?wbns=${waybill}&pdf=true&pdf_size=${pdfSize}`;

        const res = await fetch(labelUrl, {
            headers: {
                Authorization: `Token ${DELHIVERY_TOKEN}`,
                Accept: "application/pdf, application/json",
            },
        });

        const contentType = res.headers.get("content-type") || "";

        // If Delhivery returns JSON with a download link
        if (contentType.includes("application/json")) {
            const data = await res.json();

            // Check if there's a PDF download link in the response
            const packages = Array.isArray(data) ? data : data?.packages || [data];
            for (const pkg of packages) {
                if (pkg?.pdf_download_link) {
                    // Fetch the actual PDF from the S3 link
                    const pdfRes = await fetch(pkg.pdf_download_link);
                    const pdfBuffer = await pdfRes.arrayBuffer();
                    return new NextResponse(pdfBuffer, {
                        headers: {
                            "Content-Type": "application/pdf",
                            "Content-Disposition": `inline; filename="label-${waybill}.pdf"`,
                        },
                    });
                }
            }

            // Return JSON as-is if no PDF link found
            return NextResponse.json({
                success: false,
                error: "No PDF link found in Delhivery response",
                data
            }, { status: 400 });
        }

        // If Delhivery returns PDF directly, proxy it
        if (contentType.includes("application/pdf") || contentType.includes("octet-stream")) {
            const pdfBuffer = await res.arrayBuffer();
            return new NextResponse(pdfBuffer, {
                headers: {
                    "Content-Type": "application/pdf",
                    "Content-Disposition": `inline; filename="label-${waybill}.pdf"`,
                },
            });
        }

        // Fallback: return the raw response
        const text = await res.text();
        return NextResponse.json({
            success: false,
            error: `Unexpected response type: ${contentType}`,
            body: text.slice(0, 500),
        }, { status: 400 });

    } catch (error) {
        console.error("Label fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch shipping label" }, { status: 500 });
    }
}
