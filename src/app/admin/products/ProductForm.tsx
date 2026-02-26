"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/actions/product.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUpload } from "@/components/admin/forms/FileUpload";
import { ProductPreviewCard } from "./ProductPreviewCard";

interface ProductFormData {
  _id?: string;
  name: string;
  slug?: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  brand?: string;
  tags: string[];
  mainImage: string;
  images: string[];
  video?: string;
  pricing: { sellingPrice: number; mrp: number; discount: number; gst: number };
  inventory: { stock: number; sku: string; inStock: boolean; lowStockThreshold: number };
  shipping: { weight?: number; deliveryCharge: number; freeShipping: boolean; deliveryDays: number };
  seo: { seoTitle: string; metaDescription: string; keywords: string[] };
  status: "draft" | "published" | "deleted";
  featured: boolean;
  trending: boolean;
  showOnHome: boolean;
  spiritualBenefits?: string;
  howToUse?: string;
  authenticityCertificate?: string;
  panditRecommended: boolean;
}

const defaultValues: ProductFormData = {
  name: "",
  shortDescription: "",
  fullDescription: "",
  category: "",
  tags: [],
  mainImage: "",
  images: [],
  pricing: { sellingPrice: 0, mrp: 0, discount: 0, gst: 0 },
  inventory: { stock: 0, sku: "", inStock: true, lowStockThreshold: 5 },
  shipping: { deliveryCharge: 0, freeShipping: false, deliveryDays: 7 },
  seo: { seoTitle: "", metaDescription: "", keywords: [] },
  status: "draft",
  featured: false,
  trending: false,
  showOnHome: false,
  panditRecommended: false,
};

export function ProductForm({ product }: { product?: ProductFormData }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ProductFormData>(product || defaultValues);

  function appendFormData(formData: FormData, key: string, value: unknown) {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach((item, i) => formData.append(`${key}[${i}]`, typeof item === "string" ? item : String(item)));
    } else if (typeof value === "object" && value !== null && !(value instanceof Date)) {
      Object.entries(value as Record<string, unknown>).forEach(([k, v]) => appendFormData(formData, k, v));
    } else {
      formData.append(key, String(value));
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData();
    appendFormData(formData, "name", form.name);
    appendFormData(formData, "slug", form.slug);
    appendFormData(formData, "shortDescription", form.shortDescription);
    appendFormData(formData, "fullDescription", form.fullDescription);
    appendFormData(formData, "category", form.category);
    appendFormData(formData, "brand", form.brand);
    appendFormData(formData, "tags", form.tags);
    const mainImg = form.mainImage || (form.images?.[0] ?? "");
    appendFormData(formData, "mainImage", mainImg);
    appendFormData(formData, "images", form.images?.length ? form.images : [mainImg].filter(Boolean));
    appendFormData(formData, "video", form.video);
    appendFormData(formData, "sellingPrice", form.pricing?.sellingPrice ?? 0);
    appendFormData(formData, "mrp", form.pricing?.mrp ?? 0);
    appendFormData(formData, "discount", form.pricing?.discount ?? 0);
    appendFormData(formData, "gst", form.pricing?.gst ?? 0);
    appendFormData(formData, "stock", form.inventory?.stock ?? 0);
    appendFormData(formData, "sku", form.inventory?.sku ?? "");
    appendFormData(formData, "inStock", form.inventory?.inStock ?? true);
    appendFormData(formData, "lowStockThreshold", form.inventory?.lowStockThreshold ?? 5);
    appendFormData(formData, "deliveryCharge", form.shipping?.deliveryCharge ?? 0);
    appendFormData(formData, "freeShipping", form.shipping?.freeShipping ?? false);
    appendFormData(formData, "deliveryDays", form.shipping?.deliveryDays ?? 7);
    if (form.shipping?.weight) appendFormData(formData, "weight", form.shipping.weight);
    appendFormData(formData, "seoTitle", form.seo?.seoTitle ?? "");
    appendFormData(formData, "metaDescription", form.seo?.metaDescription ?? "");
    if (form.seo?.keywords?.length) formData.append("keywords", form.seo.keywords.join(","));
    appendFormData(formData, "status", form.status);
    appendFormData(formData, "featured", form.featured);
    appendFormData(formData, "trending", form.trending);
    appendFormData(formData, "showOnHome", form.showOnHome);
    appendFormData(formData, "spiritualBenefits", form.spiritualBenefits);
    appendFormData(formData, "howToUse", form.howToUse);
    appendFormData(formData, "authenticityCertificate", form.authenticityCertificate);
    appendFormData(formData, "panditRecommended", form.panditRecommended);

    const result = product?._id ? await updateProduct(product._id, formData) : await createProduct(formData);
    setLoading(false);
    if (result?.error) {
      const errMsg = typeof result.error === "string" ? result.error : "Validation failed";
      const details = "details" in result && typeof result.details === "string" ? result.details : "";
      setError(details ? `${errMsg}: ${details}` : errMsg);
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-maroon-200 bg-maroon-50 p-4 text-sm text-maroon-800">
          <p className="font-medium">Error</p>
          <p className="mt-1 whitespace-pre-wrap">{error}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Basic Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. rudraksha, samagri, books"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Textarea
              id="shortDescription"
              rows={2}
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullDescription">Full Description</Label>
            <Textarea
              id="fullDescription"
              rows={5}
              value={form.fullDescription}
              onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Main Image</Label>
            <FileUpload
              value={form.mainImage}
              onChange={(url) => setForm({ ...form, mainImage: url as string, images: form.images?.length ? form.images : [url as string].filter(Boolean) })}
              folder="products"
            />
          </div>
          <div className="space-y-2">
            <Label>Gallery Images</Label>
            <FileUpload
              value={form.images}
              onChange={(v) => setForm({ ...form, images: Array.isArray(v) ? v : v ? [v] : [] })}
              folder="products"
              multiple
            />
          </div>
          <div className="space-y-2">
            <Label>Video URL</Label>
            <Input
              placeholder="https://youtube.com/..."
              value={form.video || ""}
              onChange={(e) => setForm({ ...form, video: e.target.value || undefined })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing & Inventory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Selling Price (₹)</Label>
              <Input
                type="number"
                min={0}
                value={form.pricing?.sellingPrice ?? 0}
                onChange={(e) => setForm({ ...form, pricing: { ...form.pricing, sellingPrice: Number(e.target.value) || 0 } })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>MRP (₹)</Label>
              <Input
                type="number"
                min={0}
                value={form.pricing?.mrp ?? 0}
                onChange={(e) => setForm({ ...form, pricing: { ...form.pricing, mrp: Number(e.target.value) || 0 } })}
              />
            </div>
            <div className="space-y-2">
              <Label>Discount (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={form.pricing?.discount ?? 0}
                onChange={(e) => setForm({ ...form, pricing: { ...form.pricing, discount: Number(e.target.value) || 0 } })}
              />
            </div>
            <div className="space-y-2">
              <Label>Stock</Label>
              <Input
                type="number"
                min={0}
                value={form.inventory?.stock ?? 0}
                onChange={(e) => setForm({ ...form, inventory: { ...form.inventory, stock: Number(e.target.value) || 0 } })}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>SKU</Label>
              <Input
                value={form.inventory?.sku ?? ""}
                onChange={(e) => setForm({ ...form, inventory: { ...form.inventory, sku: e.target.value } })}
              />
            </div>
            <label className="flex items-center gap-2 pt-8">
              <input
                type="checkbox"
                checked={form.inventory?.inStock ?? true}
                onChange={(e) => setForm({ ...form, inventory: { ...form.inventory, inStock: e.target.checked } })}
              />
              In Stock
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status & SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) => setForm({ ...form, status: v as "draft" | "published" | "deleted" })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Featured
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.trending} onChange={(e) => setForm({ ...form, trending: e.target.checked })} />
              Trending
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.showOnHome} onChange={(e) => setForm({ ...form, showOnHome: e.target.checked })} />
              Show on Home
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.panditRecommended} onChange={(e) => setForm({ ...form, panditRecommended: e.target.checked })} />
              Pandit Recommended
            </label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoTitle">SEO Title</Label>
            <Input
              id="seoTitle"
              value={form.seo?.seoTitle ?? ""}
              onChange={(e) => setForm({ ...form, seo: { ...form.seo, seoTitle: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              rows={2}
              value={form.seo?.metaDescription ?? ""}
              onChange={(e) => setForm({ ...form, seo: { ...form.seo, metaDescription: e.target.value } })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <p className="text-sm text-gray-500">How this product will look on the store listing</p>
        </CardHeader>
        <CardContent>
          <ProductPreviewCard
            name={form.name || "Product Name"}
            category={form.category || "Category"}
            image={form.mainImage || form.images?.[0] || ""}
            shortDescription={form.shortDescription || ""}
            sellingPrice={form.pricing?.sellingPrice ?? 0}
            mrp={form.pricing?.mrp || undefined}
            discount={form.pricing?.discount || undefined}
            featured={form.featured}
          />
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
