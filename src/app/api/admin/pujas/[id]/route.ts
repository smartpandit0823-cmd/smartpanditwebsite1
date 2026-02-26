import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Puja from "@/models/Puja";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/services/audit.service";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectDB();
    const puja = await Puja.findById(id).lean();
    if (!puja) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ data: JSON.parse(JSON.stringify(puja)) });
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectDB();

    try {
        const body = await req.json();
        const puja = await Puja.findByIdAndUpdate(id, body, { new: true });
        if (!puja) return NextResponse.json({ error: "Not found" }, { status: 404 });

        await createAuditLog({
            adminId: session.user.id,
            adminName: session.user.name || "Admin",
            adminEmail: session.user.email || "",
            action: "update",
            entity: "Puja",
            entityId: id,
            description: `Updated puja: ${puja.name}`,
            after: body,
        });

        revalidatePath("/admin/pujas");
        revalidatePath(`/admin/pujas/${id}`);
        revalidatePath("/puja");
        revalidatePath(`/puja/${puja.slug}`);
        revalidatePath("/");

        return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(puja)) });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Update failed";
        return NextResponse.json({ error: msg }, { status: 400 });
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await connectDB();

    const puja = await Puja.findByIdAndUpdate(
        id,
        { status: "deleted", deletedAt: new Date() },
        { new: true }
    );
    if (!puja) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await createAuditLog({
        adminId: session.user.id,
        adminName: session.user.name || "Admin",
        adminEmail: session.user.email || "",
        action: "delete",
        entity: "Puja",
        entityId: id,
        description: `Soft deleted puja: ${puja.name}`,
    });

    // Revalidate both admin AND public pages so deleted puja disappears from frontend
    revalidatePath("/admin/pujas");
    revalidatePath("/puja");
    revalidatePath(`/puja/${puja.slug}`);
    revalidatePath("/");

    return NextResponse.json({ success: true });
}
