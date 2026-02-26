"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/admin/forms/FileUpload";

type BannerData = {
  _id?: string;
  title: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  position: "home" | "puja" | "store" | "astrology";
  status: "active" | "inactive";
  order: number;
  startsAt?: string;
  endsAt?: string;
};

export function BannerForm({ banner }: { banner?: BannerData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<BannerData>({
    title: banner?.title ?? "",
    subtitle: banner?.subtitle ?? "",
    image: banner?.image ?? "",
    mobileImage: banner?.mobileImage ?? "",
    link: banner?.link ?? "",
    position: banner?.position ?? "home",
    status: banner?.status ?? "active",
    order: banner?.order ?? 0,
    startsAt: banner?.startsAt ? new Date(banner.startsAt).toISOString().slice(0, 16) : "",
    endsAt: banner?.endsAt ? new Date(banner.endsAt).toISOString().slice(0, 16) : "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        order: Number(form.order),
        startsAt: form.startsAt || undefined,
        endsAt: form.endsAt || undefined,
      };
      if (banner?._id) {
        const res = await fetch(`/api/admin/banners/${banner._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (res.ok) router.push("/admin/banners");
      } else {
        const res = await fetch("/api/admin/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.id) router.push(`/admin/banners/${data.id}`);
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
        <Label>Subtitle (optional)</Label>
        <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
      </div>
      <div>
        <Label>Image</Label>
        <FileUpload value={form.image} onChange={(url) => setForm({ ...form, image: url as string })} folder="banners" />
      </div>
      <div>
        <Label>Mobile Image (optional)</Label>
        <FileUpload value={form.mobileImage} onChange={(url) => setForm({ ...form, mobileImage: url as string })} folder="banners" />
      </div>
      <div>
        <Label>Link (optional)</Label>
        <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/offers" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Position</Label>
          <Select value={form.position} onValueChange={(v: "home" | "puja" | "store" | "astrology") => setForm({ ...form, position: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="home">Home</SelectItem><SelectItem value="puja">Puja</SelectItem><SelectItem value="store">Store</SelectItem><SelectItem value="astrology">Astrology</SelectItem></SelectContent>
          </Select>
        </div>
        <div>
          <Label>Order</Label>
          <Input type="number" min={0} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) || 0 })} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={form.status === "active"} onCheckedChange={(v) => setForm({ ...form, status: v ? "active" : "inactive" })} />
        <Label>Active</Label>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Starts At</Label><Input type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} /></div>
        <div><Label>Ends At</Label><Input type="datetime-local" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} /></div>
      </div>
      <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
    </form>
  );
}
