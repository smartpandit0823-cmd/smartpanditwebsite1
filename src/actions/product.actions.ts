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

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const raw = parseFormDataToRaw(formData);
  const data = {
    name: raw.name,
    slug: (raw.slug as string) || slugify(String(raw.name)),
    shortDescription: raw.shortDescription,
    fullDescription: raw.fullDescription,
    category: raw.category,
    brand: raw.brand || undefined,
    tags: Array.isArray(raw.tags) ? (raw.tags as unknown[]).filter((x): x is string => Boolean(x)) : raw.tags ? String(raw.tags).split(",").map((s) => s.trim()).filter(Boolean) : [],
    mainImage: raw.mainImage,
    images: Array.isArray(raw.images) && (raw.images as unknown[]).length
      ? (raw.images as unknown[]).filter((x): x is string => Boolean(x))
      : raw.mainImage ? [String(raw.mainImage)] : [],
    video: raw.video || undefined,
    pricing: {
      sellingPrice: Number(raw.sellingPrice) ?? 0,
      mrp: Number(raw.mrp) ?? 0,
      discount: Number(raw.discount) ?? 0,
      gst: Number(raw.gst) ?? 0,
    },
    inventory: {
      stock: Number(raw.stock) ?? 0,
      sku: String(raw.sku || ""),
      inStock: raw.inStock === "true" || raw.inStock === true,
      lowStockThreshold: Number(raw.lowStockThreshold) ?? 5,
    },
    shipping: {
      weight: raw.weight ? Number(raw.weight) : undefined,
      deliveryCharge: Number(raw.deliveryCharge) ?? 0,
      freeShipping: raw.freeShipping === "true",
      deliveryDays: Number(raw.deliveryDays) ?? 7,
    },
    seo: {
      seoTitle: String(raw.seoTitle || ""),
      metaDescription: String(raw.metaDescription || ""),
      keywords: typeof raw.keywords === "string" && raw.keywords ? raw.keywords.split(",").map((s) => s.trim()).filter(Boolean) : Array.isArray(raw.keywords) ? raw.keywords : [],
    },
    status: (raw.status as string) || "draft",
    featured: raw.featured === "true" || raw.featured === true,
    trending: raw.trending === "true" || raw.trending === true,
    showOnHome: raw.showOnHome === "true" || raw.showOnHome === true,
    spiritualBenefits: raw.spiritualBenefits || undefined,
    howToUse: raw.howToUse || undefined,
    authenticityCertificate: raw.authenticityCertificate || undefined,
    panditRecommended: raw.panditRecommended === "true" || raw.panditRecommended === true,
  };

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
    const product = await Product.create(parsed.data);
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
  const data = {
    name: raw.name,
    slug: (raw.slug as string) || slugify(String(raw.name)),
    shortDescription: raw.shortDescription,
    fullDescription: raw.fullDescription,
    category: raw.category,
    brand: raw.brand || undefined,
    tags: Array.isArray(raw.tags) ? (raw.tags as unknown[]).filter((x): x is string => Boolean(x)) : raw.tags ? String(raw.tags).split(",").map((s) => s.trim()).filter(Boolean) : [],
    mainImage: raw.mainImage,
    images: Array.isArray(raw.images) && (raw.images as unknown[]).length
      ? (raw.images as unknown[]).filter((x): x is string => Boolean(x))
      : raw.mainImage ? [String(raw.mainImage)] : [],
    video: raw.video || undefined,
    pricing: {
      sellingPrice: Number(raw.sellingPrice) ?? 0,
      mrp: Number(raw.mrp) ?? 0,
      discount: Number(raw.discount) ?? 0,
      gst: Number(raw.gst) ?? 0,
    },
    inventory: {
      stock: Number(raw.stock) ?? 0,
      sku: String(raw.sku || ""),
      inStock: raw.inStock === "true" || raw.inStock === true,
      lowStockThreshold: Number(raw.lowStockThreshold) ?? 5,
    },
    shipping: {
      weight: raw.weight ? Number(raw.weight) : undefined,
      deliveryCharge: Number(raw.deliveryCharge) ?? 0,
      freeShipping: raw.freeShipping === "true",
      deliveryDays: Number(raw.deliveryDays) ?? 7,
    },
    seo: {
      seoTitle: String(raw.seoTitle || ""),
      metaDescription: String(raw.metaDescription || ""),
      keywords: typeof raw.keywords === "string" && raw.keywords ? raw.keywords.split(",").map((s) => s.trim()).filter(Boolean) : Array.isArray(raw.keywords) ? raw.keywords : [],
    },
    status: (raw.status as string) || "draft",
    featured: raw.featured === "true" || raw.featured === true,
    trending: raw.trending === "true" || raw.trending === true,
    showOnHome: raw.showOnHome === "true" || raw.showOnHome === true,
    spiritualBenefits: raw.spiritualBenefits || undefined,
    howToUse: raw.howToUse || undefined,
    authenticityCertificate: raw.authenticityCertificate || undefined,
    panditRecommended: raw.panditRecommended === "true" || raw.panditRecommended === true,
  };

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
    const updated = await Product.findByIdAndUpdate(id, parsed.data, { new: true });
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
    return { success: true };
  } catch (e) {
    console.error("[updateProduct]", e);
    const msg = e instanceof Error ? e.message : "Failed to update product";
    return { error: "Failed to update product", details: String(msg) };
  }
}
