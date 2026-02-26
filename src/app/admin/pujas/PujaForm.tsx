"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePujaSchema, type CreatePujaInput } from "@/schemas/puja.schema";
import { createPuja, updatePuja } from "@/actions/puja.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/admin/forms/FileUpload";
import { PujaPreviewCard } from "./PujaPreviewCard";
import { Plus, Trash2 } from "lucide-react";

// ── Helpers ─────────────────────────────────────────────────────────────

function TagsInput({ value, onChange, placeholder }: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");
  function add() {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) onChange([...value, trimmed]);
    setInput("");
  }
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 min-h-[36px] rounded-lg border border-input bg-background p-2">
        {value.map((tag, i) => (
          <span key={i} className="flex items-center gap-1 rounded-full bg-saffron-100 px-3 py-0.5 text-sm text-saffron-800">
            {tag}
            <button type="button" onClick={() => onChange(value.filter((_, idx) => idx !== i))} className="text-saffron-500 hover:text-red-600">&times;</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder || "Type and press Enter"}
          className="flex-1"
        />
        <Button type="button" variant="outline" size="sm" onClick={add}>Add</Button>
      </div>
    </div>
  );
}

// ── Default values ───────────────────────────────────────────────────────

const defaultValues: Partial<CreatePujaInput> = {
  name: "", shortDescription: "", longDescription: "", images: [],
  pujaType: "online", samagriIncluded: false, category: "", difficultyLevel: "easy",
  popular: false, featured: false, trending: false, panditRecommended: false,
  templeName: "", googleMapsUrl: "",
  maxBookingsPerDay: 10, maxPeopleAllowed: 0,
  benefits: [], whenToDo: "", whoShouldDo: "", process: [],
  samagriList: [], faqs: [], locationDetails: "", importantNotes: [],
  trustBadges: [], eligibility: "", resultTimeline: "", preparationSteps: [],
  dosAndDonts: { dos: [], donts: [] },
  muhuratGuidance: "", panditDetails: "", reportIncluded: false, videoRecordingIncluded: false,
  languagesAvailable: [],
  packages: [
    { name: "basic", price: 0, includedList: [], duration: "", panditExperience: "", extras: "", highlightDifference: "" },
    { name: "medium", price: 0, includedList: [], duration: "", panditExperience: "", extras: "", highlightDifference: "" },
    { name: "premium", price: 0, includedList: [], duration: "", panditExperience: "", extras: "", highlightDifference: "" },
  ],
  bookingSettings: { advanceAmount: 0, fullPaymentRequired: false, rescheduleAllowed: true, cancellationAllowed: true, cancellationPolicy: "", rescheduleCutoffHours: 24, cancellationCutoffHours: 24 },
  seo: { seoTitle: "", metaDescription: "", keywords: [] },
  status: "draft",
};

// ── Form ─────────────────────────────────────────────────────────────────

export function PujaForm({ puja }: { puja?: CreatePujaInput & { _id: string } }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<CreatePujaInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreatePujaSchema) as any,
    defaultValues: puja || defaultValues,
  });

  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({ control: form.control, name: "faqs" });

  async function onSubmit(data: CreatePujaInput) {
    setError(""); setLoading(true);
    const result = puja ? await updatePuja(puja._id, data) : await createPuja(data);
    setLoading(false);
    if (result?.error) {
      const d = "details" in result ? result.details : "";
      setError(d ? `${result.error}: ${d}` : (result.error as string));
      return;
    }
    router.push("/admin/pujas");
    router.refresh();
  }

  const w = form.watch;

  return (
    <form onSubmit={form.handleSubmit(onSubmit as never)} className="space-y-6">

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-semibold">Error</p>
          <p className="mt-1 whitespace-pre-wrap">{error}</p>
        </div>
      )}

      {/* ── BASIC INFO ── */}
      <Card>
        <CardHeader><CardTitle>📖 Basic Info</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input {...form.register("name")} placeholder="e.g. Satyanarayan Puja" />
              {form.formState.errors.name && <p className="text-xs text-red-600">{form.formState.errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Puja Type</Label>
              <Select value={w("pujaType")} onValueChange={(v) => form.setValue("pujaType", v as "online" | "offline" | "temple")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline (Home)</SelectItem>
                  <SelectItem value="temple">Temple</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Input {...form.register("category")} placeholder="e.g. Festivals, Dosha Shanti" />
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input {...form.register("duration")} placeholder="e.g. 2-3 hours, 3 days" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Short Description *</Label>
            <Textarea rows={2} {...form.register("shortDescription")} placeholder="1-2 line summary shown on cards" />
          </div>
          <div className="space-y-2">
            <Label>Long Description *</Label>
            <Textarea rows={5} {...form.register("longDescription")} placeholder="Detailed description, history, significance..." />
          </div>
          <div className="space-y-2">
            <Label>Images</Label>
            <FileUpload value={w("images")} onChange={(v) => form.setValue("images", Array.isArray(v) ? v : v ? [v] : [])} folder="pujas" multiple />
          </div>
        </CardContent>
      </Card>

      {/* ── CONTENT SECTIONS ── */}
      <Card>
        <CardHeader><CardTitle>✅ Benefits & Who Should Do</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Benefits (one per line)</Label>
            <TagsInput value={w("benefits") || []} onChange={(v) => form.setValue("benefits", v)} placeholder="e.g. Peace of mind" />
          </div>
          <div className="space-y-2">
            <Label>When to Do this Puja</Label>
            <Textarea rows={2} {...form.register("whenToDo")} placeholder="e.g. On amavasya, during pitru paksha..." />
          </div>
          <div className="space-y-2">
            <Label>Who Should Do (Eligibility)</Label>
            <Textarea rows={2} {...form.register("whoShouldDo")} placeholder="e.g. Anyone suffering from pitru dosha..." />
          </div>
          <div className="space-y-2">
            <Label>Eligibility / Requirements</Label>
            <Textarea rows={2} {...form.register("eligibility")} placeholder="e.g. Must fast before puja..." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>⚙️ Process / How It Works</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <Label>Steps (one per entry)</Label>
          <TagsInput value={w("process") || []} onChange={(v) => form.setValue("process", v)} placeholder="e.g. Sankalp, Ganesh puja..." />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>🌿 Samagri List</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <TagsInput value={w("samagriList") || []} onChange={(v) => form.setValue("samagriList", v)} placeholder="e.g. Flowers, Incense, Copper pot..." />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...form.register("samagriIncluded")} />
            Samagri included in package price
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            ❓ FAQs
            <Button type="button" size="sm" variant="outline" onClick={() => appendFaq({ question: "", answer: "" })}>
              <Plus className="mr-1 h-3 w-3" />Add FAQ
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {faqFields.length === 0 && <p className="text-sm text-gray-400">No FAQs yet. Click 'Add FAQ'.</p>}
          {faqFields.map((field, i) => (
            <div key={field.id} className="rounded-lg border border-gold-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-warm-700">FAQ #{i + 1}</span>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeFaq(i)} className="text-red-400">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Input {...form.register(`faqs.${i}.question`)} placeholder="Question" />
                <Textarea rows={2} {...form.register(`faqs.${i}.answer`)} placeholder="Answer" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>📍 Location, Temple & Notes</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Temple / Venue Name</Label>
              <Input {...form.register("templeName")} placeholder="e.g. Trimbakeshwar Shiva Temple" />
              <p className="text-xs text-gray-400">Shown on puja cards & detail page</p>
            </div>
            <div className="space-y-2">
              <Label>Temple / Venue Address</Label>
              <Input {...form.register("templeLocation")} placeholder="e.g. Trimbakeshwar, Nashik, Maharashtra" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Google Maps Link (for Get Direction button)</Label>
            <Input {...form.register("googleMapsUrl")} placeholder="https://maps.google.com/..." />
            <p className="text-xs text-gray-400">Paste the Google Maps sharing link. Users can tap &quot;Get Direction&quot; to open it.</p>
          </div>
          <div className="space-y-2">
            <Label>Location Details (full description)</Label>
            <Textarea rows={2} {...form.register("locationDetails")} placeholder="How to reach, nearest railway station, parking info..." />
          </div>
          <div className="space-y-2">
            <Label>Important Notes</Label>
            <TagsInput value={w("importantNotes") || []} onChange={(v) => form.setValue("importantNotes", v)} placeholder="e.g. Carry ID proof..." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>🏅 Trust Badges</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-gray-500">Add trust signals shown below puja title (e.g. "Verified Pandit", "500+ Bookings")</p>
          {(w("trustBadges") || []).map((badge, i) => (
            <div key={i} className="flex gap-2">
              <Input {...form.register(`trustBadges.${i}.icon`)} className="w-16" placeholder="🙏" />
              <Input {...form.register(`trustBadges.${i}.label`)} placeholder="Badge text" className="flex-1" />
              <Button type="button" variant="ghost" size="icon" onClick={() => {
                const curr = w("trustBadges") || [];
                form.setValue("trustBadges", curr.filter((_, idx) => idx !== i));
              }} className="text-red-400"><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => form.setValue("trustBadges", [...(w("trustBadges") || []), { icon: "✅", label: "" }])}>
            <Plus className="mr-1 h-3 w-3" />Add Badge
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>📅 Timeline & Guidance</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Result Timeline</Label>
            <Textarea rows={2} {...form.register("resultTimeline")} placeholder="e.g. Effects seen within 11-40 days after puja..." />
          </div>
          <div className="space-y-2">
            <Label>Muhurat Guidance</Label>
            <Textarea rows={2} {...form.register("muhuratGuidance")} placeholder="e.g. Best performed on Amavasya, Purnima..." />
          </div>
          <div className="space-y-2">
            <Label>Best Muhurat (specific date/time)</Label>
            <Input {...form.register("bestMuhurat")} placeholder="e.g. Pitru Paksha 2025" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>🧘 Preparation & Do's / Don'ts</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Preparation Steps (before puja)</Label>
            <TagsInput value={w("preparationSteps") || []} onChange={(v) => form.setValue("preparationSteps", v)} placeholder="e.g. Fast from morning..." />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Do's ✅</Label>
              <TagsInput value={w("dosAndDonts.dos") || []} onChange={(v) => form.setValue("dosAndDonts.dos", v)} placeholder="e.g. Wear clean clothes" />
            </div>
            <div className="space-y-2">
              <Label>Don'ts ❌</Label>
              <TagsInput value={w("dosAndDonts.donts") || []} onChange={(v) => form.setValue("dosAndDonts.donts", v)} placeholder="e.g. No non-veg food" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>👨‍🦳 Pandit & Deliverables</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Pandit Details</Label>
            <Textarea rows={2} {...form.register("panditDetails")} placeholder="e.g. Vedic-trained, 15+ years experience, Kashi-certified..." />
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...form.register("reportIncluded")} />
              Puja Report / Certificate provided
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...form.register("videoRecordingIncluded")} />
              Video Recording included
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>🌐 Languages & Capacity</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Languages Available</Label>
            <TagsInput value={w("languagesAvailable") || []} onChange={(v) => form.setValue("languagesAvailable", v)} placeholder="e.g. Hindi, Sanskrit, Marathi..." />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Max People Allowed (0 = unlimited)</Label>
              <Input type="number" min={0} {...form.register("maxPeopleAllowed", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label>Max Bookings/Day</Label>
              <Input type="number" min={1} {...form.register("maxBookingsPerDay", { valueAsNumber: true })} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── PACKAGES ── */}
      <Card>
        <CardHeader><CardTitle>💰 Packages</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {(w("packages") || []).map((_, i) => (
            <div key={i} className="rounded-lg border border-gold-200 bg-warm-50/30 p-4">
              <p className="mb-3 font-semibold capitalize text-saffron-800">{w(`packages.${i}.name`)} Package</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Price (₹) *</Label>
                  <Input type="number" {...form.register(`packages.${i}.price`, { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input {...form.register(`packages.${i}.duration`)} placeholder="e.g. 2 hours" />
                </div>
                <div className="space-y-2">
                  <Label>Pandit Experience</Label>
                  <Input {...form.register(`packages.${i}.panditExperience`)} placeholder="e.g. Standard pandit" />
                </div>
                <div className="space-y-2">
                  <Label>Highlight Difference</Label>
                  <Input {...form.register(`packages.${i}.highlightDifference`)} placeholder="e.g. Samagri included" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Included Items</Label>
                  <TagsInput
                    value={w(`packages.${i}.includedList`) || []}
                    onChange={(v) => form.setValue(`packages.${i}.includedList`, v)}
                    placeholder="e.g. Puja thali, Flowers..."
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── BOOKING SETTINGS ── */}
      <Card>
        <CardHeader><CardTitle>📋 Booking Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Advance Amount (₹)</Label>
              <Input type="number" min={0} {...form.register("bookingSettings.advanceAmount", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label>Cancellation Policy</Label>
              <Input {...form.register("bookingSettings.cancellationPolicy")} placeholder="e.g. 24 hours full refund" />
            </div>
            <div className="space-y-2">
              <Label>Reschedule Cutoff (hours before)</Label>
              <Input type="number" min={0} {...form.register("bookingSettings.rescheduleCutoffHours", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label>Cancellation Cutoff (hours before)</Label>
              <Input type="number" min={0} {...form.register("bookingSettings.cancellationCutoffHours", { valueAsNumber: true })} />
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...form.register("bookingSettings.fullPaymentRequired")} />
              Full payment required upfront
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...form.register("bookingSettings.rescheduleAllowed")} />
              Reschedule allowed
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...form.register("bookingSettings.cancellationAllowed")} />
              Cancellation allowed
            </label>
          </div>
        </CardContent>
      </Card>

      {/* ── STATUS & SEO ── */}
      <Card>
        <CardHeader><CardTitle>⚙️ Status, SEO & Video</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={w("status")} onValueChange={(v) => form.setValue("status", v as "draft" | "active")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <Select value={w("difficultyLevel")} onValueChange={(v) => form.setValue("difficultyLevel", v as "easy" | "moderate" | "complex")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="complex">Complex</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            {(["featured", "popular", "trending", "panditRecommended"] as const).map((key) => (
              <label key={key} className="flex items-center gap-2 text-sm capitalize">
                <input type="checkbox" {...form.register(key)} />
                {key.replace(/([A-Z])/g, " $1")}
              </label>
            ))}
          </div>
          <div className="space-y-2">
            <Label>YouTube / Video URL (shown at bottom of detail page)</Label>
            <Input {...form.register("videoUrl")} placeholder="https://youtube.com/watch?v=..." />
          </div>
          <div className="space-y-2">
            <Label>SEO Title</Label>
            <Input {...form.register("seo.seoTitle")} />
          </div>
          <div className="space-y-2">
            <Label>Meta Description</Label>
            <Textarea rows={2} {...form.register("seo.metaDescription")} />
          </div>
          <div className="space-y-2">
            <Label>SEO Keywords</Label>
            <TagsInput
              value={w("seo.keywords") || []}
              onChange={(v) => form.setValue("seo.keywords", v)}
              placeholder="e.g. satyanarayan puja online"
            />
          </div>
        </CardContent>
      </Card>

      {/* ── PREVIEW ── */}
      <Card>
        <CardHeader>
          <CardTitle>👁 Preview</CardTitle>
          <p className="text-sm text-gray-500">How this puja will look on the listing page</p>
        </CardHeader>
        <CardContent>
          <PujaPreviewCard
            name={w("name") || "Puja Name"}
            category={w("category") || "Category"}
            image={w("images")?.[0] || ""}
            shortDescription={w("shortDescription") || ""}
            packages={w("packages") || []}
            popular={w("popular")}
            featured={w("featured")}
          />
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading} className="min-w-[140px]">
          {loading ? "Saving..." : puja ? "Update Puja" : "Create Puja"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
