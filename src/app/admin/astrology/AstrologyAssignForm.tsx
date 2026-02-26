"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AstrologyAssignForm({
  requestId,
  currentAstrologer,
  currentFinalCallTime,
  pandits,
}: {
  requestId: string;
  currentAstrologer?: string;
  currentFinalCallTime?: string;
  pandits: { _id: string; name: string; phone: string }[];
}) {
  const router = useRouter();
  const [astrologerId, setAstrologerId] = useState(currentAstrologer || "");
  const [finalCallTime, setFinalCallTime] = useState(currentFinalCallTime || "");
  const [loading, setLoading] = useState(false);

  async function handleAssign() {
    if (!astrologerId) return;
    setLoading(true);
    const res = await fetch(`/api/admin/astrology/${requestId}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ astrologerId, finalCallTime: finalCallTime || undefined }),
    });
    setLoading(false);
    if (res.ok) router.refresh();
  }

  return (
    <div className="rounded-xl border border-gold-200 bg-white p-6 space-y-6">
      <h2 className="font-semibold">Assign Astrologer</h2>
      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-2">
          <Label>Astrologer (Pandit)</Label>
          <div className="flex gap-2">
            <Select value={astrologerId} onValueChange={setAstrologerId}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select astrologer" />
              </SelectTrigger>
              <SelectContent>
                {pandits.map((p) => (
                  <SelectItem key={p._id} value={p._id}>{p.name} ({p.phone})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Final Call Time (optional)</Label>
          <Input
            type="datetime-local"
            value={finalCallTime}
            onChange={(e) => setFinalCallTime(e.target.value)}
            className="w-[220px]"
          />
        </div>
        <Button onClick={handleAssign} disabled={loading || !astrologerId}>
          Assign
        </Button>
      </div>
      <p className="text-xs text-gray-500">If you set final call time, status will become &quot;confirmed&quot; and user will see &quot;Your call is scheduled for...&quot;</p>
    </div>
  );
}
