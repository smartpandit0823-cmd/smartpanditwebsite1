"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/admin/forms/FileUpload";

type SliderData = {
  _id?: string;
  title: string;
  image: string;
  link?: string;
  order: number;
  active: boolean;
};

export function SliderForm({ slider }: { slider?: SliderData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<SliderData>({
    title: slider?.title ?? "",
    image: slider?.image ?? "",
    link: slider?.link ?? "",
    order: slider?.order ?? 0,
    active: slider?.active ?? true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (slider?._id) {
        const res = await fetch(`/api/admin/sliders/${slider._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) router.push("/admin/sliders");
      } else {
        const res = await fetch("/api/admin/sliders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, order: Number(form.order) }),
        });
        const data = await res.json();
        if (data.id) router.push(`/admin/sliders/${data.id}`);
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
        <Label>Image</Label>
        <FileUpload value={form.image} onChange={(url) => setForm({ ...form, image: url as string })} folder="sliders" />
      </div>
      <div>
        <Label>Link</Label>
        <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/puja/ganesh-puja" />
      </div>
      <div>
        <Label>Order</Label>
        <Input type="number" min={0} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) || 0 })} />
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
        <Label>Active</Label>
      </div>
      <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
    </form>
  );
}
