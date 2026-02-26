"use server";


import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Puja from "@/models/Puja";
import { slugify } from "@/lib/utils/index";
import { CreatePujaSchema, type CreatePujaInput } from "@/schemas/puja.schema";
import { createAuditLog } from "@/services/audit.service";

// ── Helpers ──────────────────────────────────────────────────────────────────

function revalidatePublic(slug?: string) {
  revalidatePath("/puja");
  revalidatePath("/");
  if (slug) revalidatePath(`/puja/${slug}`);
}

function revalidateAdmin(id?: string) {
  revalidatePath("/admin/pujas");
  revalidatePath("/admin");
  if (id) revalidatePath(`/admin/pujas/${id}`);
}

// ── Create Puja ───────────────────────────────────────────────────────────────

export async function createPuja(input: CreatePujaInput) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const data = {
    ...input,
    slug: input.slug || slugify(input.name),
  };

  const parsed = CreatePujaSchema.safeParse(data);
  if (!parsed.success) {
    const messages = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
    return { error: "Validation failed", details: messages.join(" • ") };
  }

  try {
    await connectDB();
    const puja = await Puja.create(parsed.data);
    await createAuditLog({
      adminId: session.user.id,
      adminName: session.user.name || "Admin",
      adminEmail: session.user.email || "",
      action: "create",
      entity: "Puja",
      entityId: puja._id.toString(),
      description: `Created puja: ${puja.name}`,
      after: parsed.data as unknown as Record<string, unknown>,
    });
    revalidateAdmin();
    revalidatePublic(puja.slug);
    return { success: true, id: puja._id.toString() };
  } catch (e) {
    console.error("[createPuja]", e);
    return { error: "Failed to create puja", details: e instanceof Error ? e.message : String(e) };
  }
}

// ── Update Puja ───────────────────────────────────────────────────────────────

export async function updatePuja(id: string, input: CreatePujaInput) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const data = {
    ...input,
    slug: input.slug || slugify(input.name),
  };

  const parsed = CreatePujaSchema.safeParse(data);
  if (!parsed.success) {
    const messages = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
    return { error: "Validation failed", details: messages.join(" • ") };
  }

  try {
    await connectDB();
    const updated = await Puja.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!updated) return { error: "Puja not found" };
    await createAuditLog({
      adminId: session.user.id,
      adminName: session.user.name || "Admin",
      adminEmail: session.user.email || "",
      action: "update",
      entity: "Puja",
      entityId: id,
      description: `Updated puja: ${updated.name}`,
      after: parsed.data as unknown as Record<string, unknown>,
    });
    revalidateAdmin(id);
    revalidatePublic(updated.slug);
    return { success: true };
  } catch (e) {
    console.error("[updatePuja]", e);
    return { error: "Failed to update puja", details: e instanceof Error ? e.message : String(e) };
  }
}

// ── Soft Delete ───────────────────────────────────────────────────────────────

export async function softDeletePuja(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  try {
    await connectDB();
    const puja = await Puja.findByIdAndUpdate(id, { status: "deleted", deletedAt: new Date() });
    if (!puja) return { error: "Puja not found" };
    await createAuditLog({
      adminId: session.user.id,
      adminName: session.user.name || "Admin",
      adminEmail: session.user.email || "",
      action: "delete",
      entity: "Puja",
      entityId: id,
      description: `Soft deleted puja: ${puja.name}`,
    });
    revalidateAdmin(id);
    revalidatePublic(puja.slug);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to delete puja" };
  }
}

// ── Status Toggle ─────────────────────────────────────────────────────────────

export async function updatePujaStatus(id: string, status: "draft" | "active") {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };
  try {
    await connectDB();
    const puja = await Puja.findByIdAndUpdate(id, { status }, { new: true });
    if (!puja) return { error: "Puja not found" };
    revalidateAdmin(id);
    revalidatePublic(puja.slug);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to update status" };
  }
}
