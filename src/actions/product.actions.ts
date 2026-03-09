"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Product from "@/models/Product";
import { slugify } from "@/lib/utils/index";
import { CreateProductSchema } from "@/schemas/product.schema";
import { createAuditLog } from "@/services/audit.service";

function parseFormDataToRaw(formData: FormData): Record<string, unknown> {
  const raw: Record<string, unknown> = {};
  formData.forEach((v, k) => {
    if (k.includes("[")) {
      const parts = k.replace("]", "").split("[");
      const base = parts[0];
      const idx = parseInt(parts[1], 10);
      const key = parts[2];
      if (!raw[base]) raw[base] = [];
      const arr = raw[base] as (Record<string, unknown> | string)[];
      if (key === undefined || key === "") {
        arr[idx] = v as string;
      } else {
        if (!arr[idx] || typeof arr[idx] !== "object") arr[idx] = {};
        (arr[idx] as Record<string, unknown>)[key] = v;
      }
    } else {
      raw[k] = v;
    }
  });
  return raw;
}

function toBool(val: unknown): boolean {
  return val === "true" || val === true;
}

function buildProductData(raw: Record<string, unknown>) {
  return {
    name: raw.name,
    slug: (raw.slug as string) || slugify(String(raw.name)),
    shortTitle: raw.shortTitle || undefined,
    shortDescription: raw.shortDescription,
    fullDescription: raw.fullDescription,
    category: raw.category,
    subCategory: raw.subCategory || undefined,
    brand: raw.brand || undefined,
    tags: Array.isArray(raw.tags) ? (raw.tags as unknown[]).filter((x): x is string => Boolean(x)) : raw.tags ? String(raw.tags).split(",").map((s) => s.trim()).filter(Boolean) : [],
    mainImage: raw.mainImage,
    images: Array.isArray(raw.images) && (raw.images as unknown[]).length
      ? (raw.images as unknown[]).filter((x): x is string => Boolean(x))
      : raw.mainImage ? [String(raw.mainImage)] : [],
    video: raw.video || undefined,
    certificationImage: raw.certificationImage || undefined,
    sizeChart: raw.sizeChart || undefined,

    // Descriptions
    benefits: Array.isArray(raw.benefits) ? raw.benefits.filter(Boolean) : [],
    howToUse: raw.howToUse || undefined,
    spiritualImportance: raw.spiritualImportance || undefined,
    careInstructions: raw.careInstructions || undefined,
    spiritualBenefits: raw.spiritualBenefits || undefined,

    pricing: {
      sellingPrice: Number(raw.sellingPrice) || 0,
      mrp: Number(raw.mrp) || 0,
      discount: Number(raw.discount) || 0,
      gst: Number(raw.gst) || 0,
      costPrice: Number(raw.costPrice) || 0,
      offerTag: raw.offerTag || undefined,
    },
    inventory: {
      stock: Number(raw.stock) || 0,
      sku: String(raw.sku || ""),
      inStock: toBool(raw.inStock),
      lowStockThreshold: Number(raw.lowStockThreshold) || 5,
      weight: raw.weight || undefined,
      codAvailable: toBool(raw.codAvailable),
      returnAllowed: toBool(raw.returnAllowed),
    },
    shipping: {
      weight: raw.weight && !isNaN(parseFloat(String(raw.weight))) ? parseFloat(String(raw.weight)) : undefined,
      deliveryCharge: Number(raw.deliveryCharge) || 0,
      freeShipping: toBool(raw.freeShipping),
      deliveryDays: Number(raw.deliveryDays) || 7,
    },
    seo: {
      seoTitle: String(raw.seoTitle || ""),
      metaDescription: String(raw.metaDescription || ""),
      keywords: typeof raw.keywords === "string" && raw.keywords ? raw.keywords.split(",").map((s) => s.trim()).filter(Boolean) : Array.isArray(raw.keywords) ? raw.keywords : [],
    },
    dimensions: {
      length: String(raw.length || ""),
      width: String(raw.width || ""),
      height: String(raw.height || ""),
    },
    status: (raw.status as string) || "draft",

    // 🔥 Visibility Controls
    visibility: {
      showInBestSellers: toBool(raw.visibility_showInBestSellers),
      showInTrending: toBool(raw.visibility_showInTrending),
      showInCombos: toBool(raw.visibility_showInCombos),
      showInZodiac: toBool(raw.visibility_showInZodiac),
      showInSiddh: toBool(raw.visibility_showInSiddh),
      showInFeaturedRudraksha: toBool(raw.visibility_showInFeaturedRudraksha),
      showInVastu: toBool(raw.visibility_showInVastu),
      showInPyramids: toBool(raw.visibility_showInPyramids),
      showOnHome: toBool(raw.visibility_showOnHome),
    },

    // Purpose tags
    purposeTags: Array.isArray(raw.purposeTags) ? raw.purposeTags.filter(Boolean) : [],

    // Zodiac signs
    zodiacSigns: Array.isArray(raw.zodiacSigns) ? raw.zodiacSigns.filter(Boolean) : [],

    // Legacy compat
    featured: toBool(raw.featured),
    trending: toBool(raw.trending),
    showOnHome: toBool(raw.showOnHome),
    panditRecommended: toBool(raw.panditRecommended),
    authenticityCertificate: raw.authenticityCertificate || undefined,
  };
}

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const raw = parseFormDataToRaw(formData);
  const data = buildProductData(raw);

  const parsed = CreateProductSchema.safeParse(data);
  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    const fieldErrors = flattened.fieldErrors as Record<string, string[] | undefined>;
    const messages: string[] = [];
    if (flattened.formErrors?.length) messages.push(...flattened.formErrors);
    Object.entries(fieldErrors).forEach(([field, errs]) => {
      if (errs?.length) messages.push(`${field}: ${errs.join(", ")}`);
    });
    return { error: "Validation failed", details: messages.join(" • ") || JSON.stringify(flattened) };
  }

  try {
    await connectDB();
    // Explicitly set top-level fields required by mongoose, mapping from nested form data
    const productData = {
      ...parsed.data,
      sellingPrice: parsed.data.pricing.sellingPrice,
      mrp: parsed.data.pricing.mrp,
      sku: parsed.data.inventory.sku || `PRD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };

    const product = await Product.create(productData as any);
    await createAuditLog({
      adminId: session.user.id,
      adminName: session.user.name || "Admin",
      adminEmail: session.user.email || "",
      action: "create",
      entity: "Product",
      entityId: product._id.toString(),
      description: `Created product: ${product.name}`,
      after: parsed.data as unknown as Record<string, unknown>,
    });
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, id: product._id.toString() };
  } catch (e) {
    console.error("[createProduct]", e);
    const msg = e instanceof Error ? e.message : "Failed to create product";
    return { error: "Failed to create product", details: String(msg) };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const raw = parseFormDataToRaw(formData);
  const data = buildProductData(raw);

  const parsed = CreateProductSchema.safeParse(data);
  if (!parsed.success) {
    const flattened = parsed.error.flatten();
    const fieldErrors = flattened.fieldErrors as Record<string, string[] | undefined>;
    const messages: string[] = [];
    if (flattened.formErrors?.length) messages.push(...flattened.formErrors);
    Object.entries(fieldErrors).forEach(([field, errs]) => {
      if (errs?.length) messages.push(`${field}: ${errs.join(", ")}`);
    });
    return { error: "Validation failed", details: messages.join(" • ") || JSON.stringify(flattened) };
  }

  try {
    await connectDB();
    const productData = {
      ...parsed.data,
      sellingPrice: parsed.data.pricing.sellingPrice,
      mrp: parsed.data.pricing.mrp,
      sku: parsed.data.inventory.sku || `PRD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };

    const updated = await Product.findByIdAndUpdate(id, productData as any, { new: true });
    if (!updated) return { error: "Product not found" };
    await createAuditLog({
      adminId: session.user.id,
      adminName: session.user.name || "Admin",
      adminEmail: session.user.email || "",
      action: "update",
      entity: "Product",
      entityId: id,
      description: `Updated product: ${updated.name}`,
      after: parsed.data as unknown as Record<string, unknown>,
    });
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("[updateProduct]", e);
    const msg = e instanceof Error ? e.message : "Failed to update product";
    return { error: "Failed to update product", details: String(msg) };
  }
}

export async function deleteProduct(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await connectDB();
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return { error: "Product not found" };

    await createAuditLog({
      adminId: session.user.id,
      adminName: session.user.name || "Admin",
      adminEmail: session.user.email || "",
      action: "delete",
      entity: "Product",
      entityId: id,
      description: `Deleted product: ${deleted.name}`,
      after: { id } as any,
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("[deleteProduct]", e);
    const msg = e instanceof Error ? e.message : "Failed to delete product";
    return { error: "Failed to delete product", details: String(msg) };
  }
}
