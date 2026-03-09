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
import { cn } from "@/lib/utils";
import {
  FileText, ImageIcon, AlignLeft, IndianRupee, Package, Eye, Target, Sparkles, Search, Save, ArrowLeft, Truck
} from "lucide-react";

// ─── Types ───
interface ProductFormData {
  _id?: string;
  name: string;
  shortTitle: string;
  slug?: string;
  category: string;
  subCategory: string;
  brand: string;
  status: "draft" | "published" | "deleted";

  mainImage: string;
  images: string[];
  video: string;
  certificationImage: string;
  sizeChart: string;

  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  howToUse: string;
  spiritualImportance: string;
  careInstructions: string;

  pricing: { sellingPrice: number; mrp: number; discount: number; gst: number; costPrice: number; offerTag: string };
  inventory: { stock: number; sku: string; inStock: boolean; lowStockThreshold: number; weight: string; codAvailable: boolean; returnAllowed: boolean };
  shipping: { deliveryCharge: number; freeShipping: boolean; deliveryDays: number };
  dimensions: { length: string; width: string; height: string };
  seo: { seoTitle: string; metaDescription: string; keywords: string[] };

  visibility: {
    showInBestSellers: boolean;
    showInTrending: boolean;
    showInCombos: boolean;
    showInZodiac: boolean;
    showInSiddh: boolean;
    showInFeaturedRudraksha: boolean;
    showInVastu: boolean;
    showInPyramids: boolean;
    showOnHome: boolean;
  };

  purposeTags: string[];
  zodiacSigns: string[];

  // Legacy
  featured: boolean;
  trending: boolean;
  showOnHome: boolean;
  panditRecommended: boolean;
  spiritualBenefits: string;
  authenticityCertificate: string;
  tags: string[];
}

const defaultValues: ProductFormData = {
  name: "", shortTitle: "", category: "", subCategory: "", brand: "", status: "draft",
  mainImage: "", images: [], video: "", certificationImage: "", sizeChart: "",
  shortDescription: "", fullDescription: "", benefits: [], howToUse: "", spiritualImportance: "", careInstructions: "",
  pricing: { sellingPrice: 0, mrp: 0, discount: 0, gst: 0, costPrice: 0, offerTag: "" },
  inventory: { stock: 0, sku: "", inStock: true, lowStockThreshold: 5, weight: "", codAvailable: true, returnAllowed: false },
  shipping: { deliveryCharge: 0, freeShipping: false, deliveryDays: 7 },
  dimensions: { length: "", width: "", height: "" },
  seo: { seoTitle: "", metaDescription: "", keywords: [] },
  visibility: {
    showInBestSellers: false, showInTrending: false, showInCombos: false, showInZodiac: false,
    showInSiddh: false, showInFeaturedRudraksha: false, showInVastu: false, showInPyramids: false, showOnHome: false,
  },
  purposeTags: [], zodiacSigns: [],
  featured: false, trending: false, showOnHome: false, panditRecommended: false,
  spiritualBenefits: "", authenticityCertificate: "", tags: [],
};

// Categories
const CATEGORIES = [
  "bracelets", "rudraksha", "gemstones", "vastu", "pyramids", "siddh-collection",
  "combos", "karungali", "pyrite", "jewellery", "gifting", "puja-kits",
  "temple-products", "astrology-remedies", "spiritual-jewellery",
];

const PURPOSES = [
  { value: "wealth", label: "💰 Wealth" },
  { value: "love", label: "❤️ Love" },
  { value: "protection", label: "🛡 Protection" },
  { value: "health", label: "🩺 Health" },
  { value: "career", label: "📈 Career" },
  { value: "rashi", label: "♈ Rashi" },
];

const ZODIACS = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
];

const TABS = [
  { id: "basic", label: "Basic Info", icon: FileText },
  { id: "media", label: "Media", icon: ImageIcon },
  { id: "description", label: "Description", icon: AlignLeft },
  { id: "pricing", label: "Pricing", icon: IndianRupee },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "visibility", label: "Visibility", icon: Eye },
  { id: "purpose", label: "Purpose", icon: Target },
  { id: "zodiac", label: "Zodiac", icon: Sparkles },
  { id: "seo", label: "SEO", icon: Search },
] as const;

type TabId = typeof TABS[number]["id"];

// ─── Checkbox helper ───
function CheckboxField({ label, checked, onChange, description }: { label: string; checked: boolean; onChange: (v: boolean) => void; description?: string }) {
  return (
    <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 hover:border-saffron-300 hover:bg-saffron-50/30 transition cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-saffron-600 focus:ring-saffron-500" />
      <div>
        <span className="text-sm font-medium text-gray-900">{label}</span>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
    </label>
  );
}

// ─── Multi-select helper ───
function MultiSelectChips({ options, selected, onChange }: { options: { value: string; label: string }[]; selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (val: string) => {
    onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button key={opt.value} type="button" onClick={() => toggle(opt.value)}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
            selected.includes(opt.value)
              ? "bg-saffron-100 border-saffron-400 text-saffron-800 shadow-sm"
              : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
          )}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// MAIN FORM
// ═══════════════════════════════════════
export function ProductForm({ product }: { product?: ProductFormData }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("basic");
  const [form, setForm] = useState<ProductFormData>(product || defaultValues);

  // Auto-generate SKU
  function generateSKU() {
    const cat = (form.category || "PRD").substring(0, 3).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
    setForm({ ...form, inventory: { ...form.inventory, sku: `${cat}-${rand}` } });
  }

  // Form data builder for server action
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
    // Basic
    appendFormData(formData, "name", form.name);
    appendFormData(formData, "slug", form.slug);
    appendFormData(formData, "shortTitle", form.shortTitle);
    appendFormData(formData, "category", form.category);
    appendFormData(formData, "subCategory", form.subCategory);
    appendFormData(formData, "brand", form.brand);
    appendFormData(formData, "status", form.status);

    // Media
    const mainImg = form.mainImage || (form.images?.[0] ?? "");
    appendFormData(formData, "mainImage", mainImg);
    appendFormData(formData, "images", form.images?.length ? form.images : [mainImg].filter(Boolean));
    appendFormData(formData, "video", form.video);
    appendFormData(formData, "certificationImage", form.certificationImage);
    appendFormData(formData, "sizeChart", form.sizeChart);

    // Description
    appendFormData(formData, "shortDescription", form.shortDescription);
    appendFormData(formData, "fullDescription", form.fullDescription);
    appendFormData(formData, "benefits", form.benefits);
    appendFormData(formData, "howToUse", form.howToUse);
    appendFormData(formData, "spiritualImportance", form.spiritualImportance);
    appendFormData(formData, "careInstructions", form.careInstructions);
    appendFormData(formData, "spiritualBenefits", form.spiritualBenefits);

    // Pricing
    appendFormData(formData, "sellingPrice", form.pricing?.sellingPrice ?? 0);
    appendFormData(formData, "mrp", form.pricing?.mrp ?? 0);
    appendFormData(formData, "discount", form.pricing?.discount ?? 0);
    appendFormData(formData, "gst", form.pricing?.gst ?? 0);
    appendFormData(formData, "costPrice", form.pricing?.costPrice ?? 0);
    appendFormData(formData, "offerTag", form.pricing?.offerTag ?? "");

    // Inventory
    appendFormData(formData, "stock", form.inventory?.stock ?? 0);
    appendFormData(formData, "sku", form.inventory?.sku ?? "");
    appendFormData(formData, "inStock", form.inventory?.inStock ?? true);
    appendFormData(formData, "lowStockThreshold", form.inventory?.lowStockThreshold ?? 5);
    appendFormData(formData, "weight", form.inventory?.weight ?? "");
    appendFormData(formData, "codAvailable", form.inventory?.codAvailable ?? true);
    appendFormData(formData, "returnAllowed", form.inventory?.returnAllowed ?? false);

    // Shipping & Dimensions
    appendFormData(formData, "deliveryCharge", form.shipping?.deliveryCharge ?? 0);
    appendFormData(formData, "freeShipping", form.shipping?.freeShipping ?? false);
    appendFormData(formData, "deliveryDays", form.shipping?.deliveryDays ?? 7);

    appendFormData(formData, "length", form.dimensions?.length ?? "");
    appendFormData(formData, "width", form.dimensions?.width ?? "");
    appendFormData(formData, "height", form.dimensions?.height ?? "");

    // SEO
    appendFormData(formData, "seoTitle", form.seo?.seoTitle ?? "");
    appendFormData(formData, "metaDescription", form.seo?.metaDescription ?? "");
    if (form.seo?.keywords?.length) formData.append("keywords", form.seo.keywords.join(","));

    // Visibility
    Object.entries(form.visibility).forEach(([key, val]) => {
      appendFormData(formData, `visibility_${key}`, val);
    });

    // Purpose & Zodiac
    appendFormData(formData, "purposeTags", form.purposeTags);
    appendFormData(formData, "zodiacSigns", form.zodiacSigns);

    // Legacy
    appendFormData(formData, "featured", form.visibility.showInBestSellers);
    appendFormData(formData, "trending", form.visibility.showInTrending);
    appendFormData(formData, "showOnHome", form.visibility.showOnHome);
    appendFormData(formData, "panditRecommended", form.panditRecommended);
    appendFormData(formData, "authenticityCertificate", form.authenticityCertificate);
    appendFormData(formData, "tags", form.tags);

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
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-medium">Error</p>
          <p className="mt-1 whitespace-pre-wrap">{error}</p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar bg-gray-100 rounded-xl p-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
                activeTab === tab.id
                  ? "bg-white text-saffron-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
              )}>
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ═══ TAB 1: Basic Info ═══ */}
      {activeTab === "basic" && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><FileText size={18} /> Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Product Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. 5 Mukhi Nepal Rudraksha" required />
              </div>
              <div className="space-y-2">
                <Label>Short Title</Label>
                <Input value={form.shortTitle} onChange={(e) => setForm({ ...form, shortTitle: e.target.value })} placeholder="e.g. Original Nepal Bead" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Sub Category</Label>
                <Input value={form.subCategory} onChange={(e) => setForm({ ...form, subCategory: e.target.value })} placeholder="e.g. 5 Mukhi" />
              </div>
              <div className="space-y-2">
                <Label>Brand</Label>
                <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="e.g. SanatanSetu" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Product Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as "draft" | "published" | "deleted" })}>
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">🟡 Draft</SelectItem>
                  <SelectItem value="published">🟢 Published</SelectItem>
                  <SelectItem value="deleted">🔴 Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ═══ TAB 2: Media ═══ */}
      {activeTab === "media" && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><ImageIcon size={18} /> Media</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Main Image *</Label>
              <FileUpload value={form.mainImage} onChange={(url) => setForm({ ...form, mainImage: url as string, images: form.images?.length ? form.images : [url as string].filter(Boolean) })} folder="products" />
            </div>
            <div className="space-y-2">
              <Label>Gallery Images</Label>
              <FileUpload value={form.images} onChange={(v) => setForm({ ...form, images: Array.isArray(v) ? v : v ? [v] : [] })} folder="products" multiple />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Video URL</Label>
                <Input placeholder="https://youtube.com/..." value={form.video} onChange={(e) => setForm({ ...form, video: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Certification Image</Label>
                <FileUpload value={form.certificationImage} onChange={(v) => setForm({ ...form, certificationImage: v as string })} folder="products" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Size Chart</Label>
              <FileUpload value={form.sizeChart} onChange={(v) => setForm({ ...form, sizeChart: v as string })} folder="products" />
            </div>
            {/* Preview */}
            {form.mainImage && (
              <div className="border rounded-xl p-4 bg-gray-50">
                <p className="text-xs font-semibold text-gray-500 mb-2">Preview</p>
                <img src={form.mainImage} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ═══ TAB 3: Description ═══ */}
      {activeTab === "description" && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><AlignLeft size={18} /> Description</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Short Description *</Label>
              <Textarea rows={2} value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} placeholder="Brief product summary..." required />
            </div>
            <div className="space-y-2">
              <Label>Full Description *</Label>
              <Textarea rows={6} value={form.fullDescription} onChange={(e) => setForm({ ...form, fullDescription: e.target.value })} placeholder="Detailed product description..." required />
            </div>
            <div className="space-y-2">
              <Label>Benefits (one per line)</Label>
              <Textarea rows={3} value={form.benefits.join("\n")} onChange={(e) => setForm({ ...form, benefits: e.target.value.split("\n").filter(Boolean) })} placeholder="Attracts wealth\nReduces stress\nImproves focus" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>How to Use</Label>
                <Textarea rows={3} value={form.howToUse} onChange={(e) => setForm({ ...form, howToUse: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Spiritual Significance</Label>
                <Textarea rows={3} value={form.spiritualImportance} onChange={(e) => setForm({ ...form, spiritualImportance: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Care Instructions</Label>
              <Textarea rows={2} value={form.careInstructions} onChange={(e) => setForm({ ...form, careInstructions: e.target.value })} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* ═══ TAB 4: Pricing ═══ */}
      {activeTab === "pricing" && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><IndianRupee size={18} /> Pricing</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label>MRP (₹) *</Label>
                <Input type="number" min={0} value={form.pricing.mrp} onChange={(e) => setForm({ ...form, pricing: { ...form.pricing, mrp: Number(e.target.value) || 0 } })} required />
              </div>
              <div className="space-y-2">
                <Label>Selling Price (₹) *</Label>
                <Input type="number" min={0} value={form.pricing.sellingPrice} onChange={(e) => setForm({ ...form, pricing: { ...form.pricing, sellingPrice: Number(e.target.value) || 0 } })} required />
              </div>
              <div className="space-y-2">
                <Label>Discount (%)</Label>
                <Input type="number" min={0} max={100} value={form.pricing.mrp > 0 ? Math.round(((form.pricing.mrp - form.pricing.sellingPrice) / form.pricing.mrp) * 100) : 0} readOnly className="bg-gray-50" />
                <p className="text-[10px] text-gray-400">Auto calculated</p>
              </div>
              <div className="space-y-2">
                <Label>Cost Price (₹)</Label>
                <Input type="number" min={0} value={form.pricing.costPrice} onChange={(e) => setForm({ ...form, pricing: { ...form.pricing, costPrice: Number(e.target.value) || 0 } })} />
                <p className="text-[10px] text-gray-400">Admin only</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>GST (%)</Label>
                <Input type="number" min={0} max={28} value={form.pricing.gst} onChange={(e) => setForm({ ...form, pricing: { ...form.pricing, gst: Number(e.target.value) || 0 } })} />
              </div>
              <div className="space-y-2">
                <Label>Offer Tag</Label>
                <Select value={form.pricing.offerTag || "none"} onValueChange={(v) => setForm({ ...form, pricing: { ...form.pricing, offerTag: v === "none" ? "" : v } })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Tag</SelectItem>
                    <SelectItem value="trending">🔥 Trending</SelectItem>
                    <SelectItem value="bestseller">⭐ Best Seller</SelectItem>
                    <SelectItem value="limited">⚡ Limited Edition</SelectItem>
                    <SelectItem value="new">🆕 New Arrival</SelectItem>
                    <SelectItem value="festival">🎉 Festival Offer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Profit preview */}
            {form.pricing.sellingPrice > 0 && form.pricing.costPrice > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-emerald-700">Profit Margin</p>
                <p className="text-lg font-bold text-emerald-800 mt-1">
                  ₹{(form.pricing.sellingPrice - form.pricing.costPrice).toLocaleString()}
                  <span className="text-sm font-normal ml-2">
                    ({Math.round(((form.pricing.sellingPrice - form.pricing.costPrice) / form.pricing.sellingPrice) * 100)}%)
                  </span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ═══ TAB 5: Inventory ═══ */}
      {activeTab === "inventory" && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Package size={18} /> Inventory & Shipping</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label>Stock Quantity *</Label>
                <Input type="number" min={0} value={form.inventory.stock} onChange={(e) => setForm({ ...form, inventory: { ...form.inventory, stock: Number(e.target.value) || 0 } })} required />
              </div>
              <div className="space-y-2">
                <Label>Low Stock Alert</Label>
                <Input type="number" min={0} value={form.inventory.lowStockThreshold} onChange={(e) => setForm({ ...form, inventory: { ...form.inventory, lowStockThreshold: Number(e.target.value) || 5 } })} />
              </div>
              <div className="space-y-2">
                <Label>Weight</Label>
                <Input value={form.inventory.weight} onChange={(e) => setForm({ ...form, inventory: { ...form.inventory, weight: e.target.value } })} placeholder="e.g. 50g" />
              </div>
              <div className="space-y-2">
                <Label>SKU</Label>
                <div className="flex gap-2">
                  <Input value={form.inventory.sku} onChange={(e) => setForm({ ...form, inventory: { ...form.inventory, sku: e.target.value } })} placeholder="AUTO" />
                  <Button type="button" variant="outline" size="sm" onClick={generateSKU} className="shrink-0">Gen</Button>
                </div>
              </div>
            </div>

            {/* Packaging Dimensions for Shipping */}
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <h3 className="text-sm font-medium text-blue-900 mb-3 flex items-center gap-2">
                <Truck size={14} className="text-blue-500" /> Delhivery Packaging Dimensions (cm)
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Length (cm)</Label>
                  <Input type="number" value={form.dimensions.length} onChange={(e) => setForm({ ...form, dimensions: { ...form.dimensions, length: e.target.value } })} placeholder="e.g. 15" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Breadth / Width (cm)</Label>
                  <Input type="number" value={form.dimensions.width} onChange={(e) => setForm({ ...form, dimensions: { ...form.dimensions, width: e.target.value } })} placeholder="e.g. 10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Height (cm)</Label>
                  <Input type="number" value={form.dimensions.height} onChange={(e) => setForm({ ...form, dimensions: { ...form.dimensions, height: e.target.value } })} placeholder="e.g. 5" />
                </div>
              </div>
              <p className="mt-2 text-[10px] text-blue-600">Required for accurate Delhivery shipping label calculation.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <CheckboxField label="COD Available" checked={form.inventory.codAvailable} onChange={(v) => setForm({ ...form, inventory: { ...form.inventory, codAvailable: v } })} description="Cash on delivery" />
              <CheckboxField label="Return Allowed" checked={form.inventory.returnAllowed} onChange={(v) => setForm({ ...form, inventory: { ...form.inventory, returnAllowed: v } })} description="7 day easy return" />
              <CheckboxField label="Pandit Recommended" checked={form.panditRecommended} onChange={(v) => setForm({ ...form, panditRecommended: v })} description="Verified by pandit" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* ═══ TAB 6: Visibility Controls ═══ */}
      {activeTab === "visibility" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Eye size={18} /> Homepage Visibility</CardTitle>
            <p className="text-sm text-gray-500">Control where this product appears on the homepage horizontal sections</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <CheckboxField label="⭐ Best Sellers" checked={form.visibility.showInBestSellers}
                onChange={(v) => setForm({ ...form, visibility: { ...form.visibility, showInBestSellers: v } })}
                description="Show in Best Sellers horizontal slider" />
              <CheckboxField label="🔥 Trending Now" checked={form.visibility.showInTrending}
                onChange={(v) => setForm({ ...form, visibility: { ...form.visibility, showInTrending: v } })}
                description="Show in Trending section" />
              <CheckboxField label="🎁 Combo Deals" checked={form.visibility.showInCombos}
                onChange={(v) => setForm({ ...form, visibility: { ...form.visibility, showInCombos: v } })}
                description="Show in Combo Deals section" />
              <CheckboxField label="♈ Zodiac Section" checked={form.visibility.showInZodiac}
                onChange={(v) => setForm({ ...form, visibility: { ...form.visibility, showInZodiac: v } })}
                description="Zodiac recommendations" />
              <CheckboxField label="💎 Siddh Collection" checked={form.visibility.showInSiddh}
                onChange={(v) => setForm({ ...form, visibility: { ...form.visibility, showInSiddh: v } })}
                description="Premium dark section" />
              <CheckboxField label="📿 Featured Rudraksha" checked={form.visibility.showInFeaturedRudraksha}
                onChange={(v) => setForm({ ...form, visibility: { ...form.visibility, showInFeaturedRudraksha: v } })}
                description="Rudraksha feature section" />
              <CheckboxField label="🏠 Vastu Section" checked={form.visibility.showInVastu}
                onChange={(v) => setForm({ ...form, visibility: { ...form.visibility, showInVastu: v } })}
                description="Vastu & Idols section" />
              <CheckboxField label="🔺 Pyramids & Crystals" checked={form.visibility.showInPyramids}
                onChange={(v) => setForm({ ...form, visibility: { ...form.visibility, showInPyramids: v } })}
                description="Energy Amplifiers section" />
              <CheckboxField label="🏡 Show on Home" checked={form.visibility.showOnHome}
                onChange={(v) => setForm({ ...form, visibility: { ...form.visibility, showOnHome: v } })}
                description="General homepage visibility" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* ═══ TAB 7: Shop By Purpose ═══ */}
      {activeTab === "purpose" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Target size={18} /> Shop By Purpose</CardTitle>
            <p className="text-sm text-gray-500">Select which purposes this product serves (shown in filtered pages)</p>
          </CardHeader>
          <CardContent>
            <MultiSelectChips
              options={PURPOSES}
              selected={form.purposeTags}
              onChange={(v) => setForm({ ...form, purposeTags: v })}
            />
          </CardContent>
        </Card>
      )}

      {/* ═══ TAB 8: Zodiac ═══ */}
      {activeTab === "zodiac" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles size={18} /> Zodiac Compatibility</CardTitle>
            <p className="text-sm text-gray-500">Select zodiac signs this product is compatible with</p>
          </CardHeader>
          <CardContent>
            <MultiSelectChips
              options={ZODIACS.map((z) => ({ value: z, label: `♈ ${z.charAt(0).toUpperCase() + z.slice(1)}` }))}
              selected={form.zodiacSigns}
              onChange={(v) => setForm({ ...form, zodiacSigns: v })}
            />
          </CardContent>
        </Card>
      )}

      {/* ═══ TAB 9: SEO ═══ */}
      {activeTab === "seo" && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Search size={18} /> SEO Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>URL Slug</Label>
              <Input value={form.slug || ""} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated-from-name" />
              <p className="text-[10px] text-gray-400">Leave blank for auto-generation</p>
            </div>
            <div className="space-y-2">
              <Label>Meta Title</Label>
              <Input value={form.seo.seoTitle} onChange={(e) => setForm({ ...form, seo: { ...form.seo, seoTitle: e.target.value } })} placeholder="SEO optimized title" />
            </div>
            <div className="space-y-2">
              <Label>Meta Description</Label>
              <Textarea rows={2} value={form.seo.metaDescription} onChange={(e) => setForm({ ...form, seo: { ...form.seo, metaDescription: e.target.value } })} placeholder="155 character meta description..." />
              <p className="text-[10px] text-gray-400">{form.seo.metaDescription.length}/155 characters</p>
            </div>
            <div className="space-y-2">
              <Label>Keywords (comma separated)</Label>
              <Input value={form.seo.keywords.join(", ")} onChange={(e) => setForm({ ...form, seo: { ...form.seo, keywords: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) } })} placeholder="rudraksha, nepal, 5 mukhi" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
          <p className="text-sm text-gray-500">How this product will look on the store</p>
        </CardHeader>
        <CardContent>
          <ProductPreviewCard
            name={form.name || "Product Name"}
            category={form.category || "Category"}
            image={form.mainImage || form.images?.[0] || ""}
            shortDescription={form.shortDescription || ""}
            sellingPrice={form.pricing?.sellingPrice ?? 0}
            mrp={form.pricing?.mrp || undefined}
            discount={form.pricing?.mrp > 0 ? Math.round(((form.pricing.mrp - form.pricing.sellingPrice) / form.pricing.mrp) * 100) : undefined}
            featured={form.visibility.showInBestSellers}
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 sticky bottom-0 bg-white/95 backdrop-blur-sm py-4 px-1 border-t border-gray-100 -mx-6 sm:mx-0 sm:border-0 sm:px-0 sm:bg-transparent">
        <Button type="submit" disabled={loading} className="bg-saffron-600 hover:bg-saffron-700 text-white shadow-lg gap-2">
          <Save size={16} />
          {loading ? "Saving..." : product?._id ? "Update Product" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowLeft size={16} /> Cancel
        </Button>
        <div className="ml-auto flex items-center gap-2 text-xs text-gray-400">
          {form.visibility.showInBestSellers && <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Best Seller</span>}
          {form.visibility.showInTrending && <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">Trending</span>}
          {form.visibility.showInSiddh && <span className="bg-gray-800 text-gold-400 px-2 py-0.5 rounded-full font-medium">Siddh</span>}
        </div>
      </div>
    </form>
  );
}
