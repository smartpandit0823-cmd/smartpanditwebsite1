"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/admin/forms/FileUpload";
import { useEffect } from "react";

type OfferData = {
  _id?: string;
  title: string;
  description?: string;
  image?: string;
  type: "puja" | "store" | "astrology" | "temple" | "global";
  targetId?: string;
  targetSlug?: string;
  discount: number;
  discountType: "flat" | "percent";
  startDate?: string;
  endDate?: string;
  active: boolean;
};

export function OfferForm({ offer }: { offer?: OfferData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<OfferData>({
    title: offer?.title ?? "",
    description: offer?.description ?? "",
    image: offer?.image ?? "",
    type: offer?.type ?? "global",
    targetId: offer?.targetId ?? "",
    targetSlug: offer?.targetSlug ?? "",
    discount: offer?.discount ?? 0,
    discountType: offer?.discountType ?? "percent",
    startDate: offer?.startDate ? new Date(offer.startDate).toISOString().slice(0, 10) : "",
    endDate: offer?.endDate ? new Date(offer.endDate).toISOString().slice(0, 10) : "",
    active: offer?.active ?? true,
  });

  const [pujas, setPujas] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (form.type === "puja" && pujas.length === 0) {
      fetch("/api/admin/pujas?limit=100").then(r => r.json()).then(res => {
        const items = res.data || res.items || [];
        setPujas(items.filter((p: any) => p.status === "active"));
      });
    } else if (form.type === "store" && products.length === 0) {
      fetch("/api/admin/products?limit=100").then(r => r.json()).then(res => {
        const items = res.data || res.items || [];
        setProducts(items.filter((p: any) => p.status === "published"));
      });
    }
  }, [form.type]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        targetId: form.targetId || undefined,
        targetSlug: form.targetSlug || undefined,
        discount: Number(form.discount),
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      };
      if (offer?._id) {
        const res = await fetch(`/api/admin/offers/${offer._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) router.push("/admin/offers");
      } else {
        const res = await fetch("/api/admin/offers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.id) router.push(`/admin/offers/${data.id}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <div>
        <Label>Title</Label>
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
      </div>
      <div>
        <Label>Image</Label>
        <FileUpload value={form.image} onChange={(url) => setForm({ ...form, image: url as string })} folder="offers" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Type</Label>
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as any, targetId: "", targetSlug: "" })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Global</SelectItem>
              <SelectItem value="puja">Puja</SelectItem>
              <SelectItem value="store">Store Product</SelectItem>
              <SelectItem value="astrology">Astrology</SelectItem>
              <SelectItem value="temple">Temple</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {form.type === "puja" && (
          <div>
            <Label>Select Specific Puja</Label>
            <Select value={form.targetId} onValueChange={(v) => {
              const puja = pujas.find(p => p._id === v);
              setForm({ ...form, targetId: v, targetSlug: puja?.slug });
            }}>
              <SelectTrigger><SelectValue placeholder="Select a puja" /></SelectTrigger>
              <SelectContent>
                {pujas.map(p => (
                  <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {form.type === "store" && (
          <div>
            <Label>Select Store Product</Label>
            <Select value={form.targetId} onValueChange={(v) => {
              const product = products.find(p => p._id === v);
              setForm({ ...form, targetId: v, targetSlug: product?.slug });
            }}>
              <SelectTrigger><SelectValue placeholder="Select a product" /></SelectTrigger>
              <SelectContent>
                {products.map(p => (
                  <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div>
          <Label>Discount Type</Label>
          <Select value={form.discountType} onValueChange={(v) => setForm({ ...form, discountType: v as "flat" | "percent" })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="percent">Percent</SelectItem>
              <SelectItem value="flat">Flat</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Discount</Label>
        <Input type="number" min={0} value={form.discount} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) || 0 })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Date</Label>
          <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
        </div>
        <div>
          <Label>End Date</Label>
          <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
        <Label>Active</Label>
      </div>
      <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
    </form>
  );
}
