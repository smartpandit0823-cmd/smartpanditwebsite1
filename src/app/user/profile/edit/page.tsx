"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, Check, Camera } from "lucide-react";
import Link from "next/link";

export default function EditProfilePage() {
    const { user, loading: authLoading, refresh } = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        city: "",
        gender: "",
        dateOfBirth: "",
        birthTime: "",
        birthPlace: "",
        gotra: "",
        language: "hi",
        avatar: "",
    });
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) { router.push("/user/login"); return; }
        if (user) {
            fetch("/api/user/profile")
                .then((r) => r.json())
                .then((d) => {
                    if (d.user) {
                        setForm({
                            name: d.user.name || "",
                            email: d.user.email || "",
                            city: d.user.city || "",
                            gender: d.user.gender || "",
                            dateOfBirth: d.user.dateOfBirth ? new Date(d.user.dateOfBirth).toISOString().split("T")[0] : "",
                            birthTime: d.user.birthTime || "",
                            birthPlace: d.user.birthPlace || "",
                            gotra: d.user.gotra || "",
                            language: d.user.language || "hi",
                            avatar: d.user.avatar || "",
                        });
                    }
                    setLoading(false);
                });
        }
    }, [user, authLoading, router]);

    async function handleSave() {
        setSaving(true);
        const res = await fetch("/api/user/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                dateOfBirth: form.dateOfBirth || undefined,
            }),
        });
        if (res.ok) {
            await refresh();
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
        setSaving(false);
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            // 1. Get presigned URL
            const res = await fetch("/api/user/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                }),
            });
            const { uploadUrl, publicUrl } = await res.json();

            if (!uploadUrl) throw new Error("Could not get upload URL");

            // 2. Upload to S3 directly
            await fetch(uploadUrl, {
                method: "PUT",
                headers: { "Content-Type": file.type },
                body: file,
            });

            setForm({ ...form, avatar: publicUrl });
        } catch (error) {
            console.error(error);
            alert("Image upload failed");
        } finally {
            setUploadingImage(false);
        }
    }

    if (authLoading || loading) {
        return <div className="flex min-h-[60dvh] items-center justify-center"><Loader2 className="size-8 animate-spin text-saffron-500" /></div>;
    }

    return (
        <div className="mx-auto max-w-lg px-4 py-6 space-y-6">
            {/* Top bar */}
            <div className="flex items-center gap-3">
                <Link href="/user/profile" className="flex size-9 items-center justify-center rounded-full bg-white shadow-sm border border-warm-100">
                    <ArrowLeft size={18} />
                </Link>
                <h1 className="text-lg font-semibold text-warm-900">Edit Profile</h1>
            </div>

            {/* Basic */}
            <div className="space-y-4 rounded-2xl border border-gold-200/50 bg-white p-5">
                <h2 className="text-sm font-semibold text-warm-800">Basic Details</h2>

                {/* Avatar Upload */}
                <div className="flex flex-col items-center pb-4">
                    <div className="relative">
                        <div className="flex size-24 items-center justify-center overflow-hidden rounded-full border-2 border-saffron-200 bg-saffron-50 text-3xl font-bold text-saffron-600 shadow-sm">
                            {uploadingImage ? (
                                <Loader2 className="animate-spin text-saffron-500" />
                            ) : form.avatar ? (
                                <img src={form.avatar} alt="Profile" className="size-full object-cover" />
                            ) : (
                                form.name?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || "U"
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 flex size-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-saffron-600 text-white shadow-md transition hover:bg-saffron-700">
                            <Camera size={14} />
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={handleImageUpload}
                                disabled={uploadingImage}
                            />
                        </label>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Full Name *</Label>
                        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Phone</Label>
                        <Input value={user?.phone || ""} disabled className="bg-warm-50 text-warm-500" />
                        <p className="text-[10px] text-warm-400">Phone cannot be changed</p>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Email (Optional)</Label>
                        <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">City</Label>
                        <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Your city" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Gender</Label>
                        <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                            <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Astrology Details */}
            <div className="space-y-4 rounded-2xl border border-gold-200/50 bg-white p-5">
                <h2 className="text-sm font-semibold text-warm-800">🔮 Personal Details (Astrology)</h2>
                <p className="text-xs text-warm-400">Useful for kundli and astro consultations</p>
                <div className="space-y-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Date of Birth</Label>
                        <Input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Birth Time</Label>
                        <Input type="time" value={form.birthTime} onChange={(e) => setForm({ ...form, birthTime: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Birth Place</Label>
                        <Input value={form.birthPlace} onChange={(e) => setForm({ ...form, birthPlace: e.target.value })} placeholder="City of birth" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Gotra</Label>
                        <Input value={form.gotra} onChange={(e) => setForm({ ...form, gotra: e.target.value })} placeholder="Your gotra" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Preferred Language</Label>
                        <Select value={form.language} onValueChange={(v) => setForm({ ...form, language: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hi">Hindi</SelectItem>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="mr">Marathi</SelectItem>
                                <SelectItem value="gu">Gujarati</SelectItem>
                                <SelectItem value="ta">Tamil</SelectItem>
                                <SelectItem value="te">Telugu</SelectItem>
                                <SelectItem value="bn">Bengali</SelectItem>
                                <SelectItem value="kn">Kannada</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Save */}
            <Button
                onClick={handleSave}
                disabled={saving || !form.name.trim()}
                className="w-full rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 py-6 text-base font-semibold shadow-lg"
            >
                {saving ? (
                    <Loader2 className="animate-spin mr-2" size={18} />
                ) : saved ? (
                    <><Check size={18} className="mr-2" /> Saved!</>
                ) : (
                    "Save Profile"
                )}
            </Button>
        </div>
    );
}
