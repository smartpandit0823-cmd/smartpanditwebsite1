import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Puja from "@/models/Puja";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/services/audit.service";

export async function POST(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectDB();

    const puja = await Puja.findByIdAndUpdate(
        id,
        { status: "active", $unset: { deletedAt: 1 } },
        { new: true }
    );
    if (!puja) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await createAuditLog({
        adminId: session.user.id,
        adminName: session.user.name || "Admin",
        adminEmail: session.user.email || "",
        action: "update",
        entity: "Puja",
        entityId: id,
        description: `Restored puja: ${puja.name}`,
    });

    revalidatePath("/admin/pujas");
    revalidatePath("/puja");
    revalidatePath(`/puja/${puja.slug}`);
    revalidatePath("/");

    return NextResponse.json({ success: true });
}
