"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TeamFormData {
    _id?: string;
    name: string;
    phone: string;
    email: string;
    photo: string;
    role: string;
    skills: string;
    area: string;
    city: string;
    state: string;
    experience: number;
    languagesSpoken: string;
    bio: string;
    status: string;
}

const defaultData: TeamFormData = {
    name: "",
    phone: "",
    email: "",
    photo: "",
    role: "pandit",
    skills: "",
    area: "",
    city: "",
    state: "",
    experience: 0,
    languagesSpoken: "Hindi",
    bio: "",
    status: "active",
};

export function TeamMemberForm({ initialData }: { initialData?: Record<string, unknown> }) {
    const router = useRouter();
    const isEdit = !!initialData?._id;

    const [form, setForm] = useState<TeamFormData>(() => {
        if (initialData) {
            return {
                _id: String(initialData._id || ""),
                name: String(initialData.name || ""),
                phone: String(initialData.phone || ""),
                email: String(initialData.email || ""),
                photo: String(initialData.photo || ""),
                role: String(initialData.role || "pandit"),
                skills: Array.isArray(initialData.skills) ? (initialData.skills as string[]).join(", ") : "",
                area: String(initialData.area || ""),
                city: String(initialData.city || ""),
                state: String(initialData.state || ""),
                experience: Number(initialData.experience || 0),
                languagesSpoken: Array.isArray(initialData.languagesSpoken) ? (initialData.languagesSpoken as string[]).join(", ") : "Hindi",
                bio: String(initialData.bio || ""),
                status: String(initialData.status || "active"),
            };
        }
        return defaultData;
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function update(key: keyof TeamFormData, value: string | number) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const payload = {
            ...form,
            skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
            languagesSpoken: form.languagesSpoken.split(",").map((s) => s.trim()).filter(Boolean),
        };

        try {
            const url = isEdit ? `/api/admin/team/${form._id}` : "/api/admin/team";
            const method = isEdit ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to save");
            }

            router.push("/admin/team");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Basic Info</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone *</Label>
                        <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="photo">Photo URL</Label>
                        <Input id="photo" value={form.photo} onChange={(e) => update("photo", e.target.value)} placeholder="https://..." />
                    </div>
                    <div className="space-y-2">
                        <Label>Role *</Label>
                        <Select value={form.role} onValueChange={(v) => update("role", v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pandit">Pandit</SelectItem>
                                <SelectItem value="astrologer">Astrologer</SelectItem>
                                <SelectItem value="support">Support</SelectItem>
                                <SelectItem value="delivery">Delivery</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={form.status} onValueChange={(v) => update("status", v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Skills & Location</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="skills">Skills (comma separated)</Label>
                        <Input id="skills" value={form.skills} onChange={(e) => update("skills", e.target.value)} placeholder="e.g. Satyanarayan Puja, Griha Pravesh, Kundli" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="area">Area / Locality</Label>
                        <Input id="area" value={form.area} onChange={(e) => update("area", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input id="city" value={form.city} onChange={(e) => update("city", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input id="state" value={form.state} onChange={(e) => update("state", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="experience">Experience (years)</Label>
                        <Input id="experience" type="number" min={0} value={form.experience} onChange={(e) => update("experience", parseInt(e.target.value) || 0)} />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="languages">Languages (comma separated)</Label>
                        <Input id="languages" value={form.languagesSpoken} onChange={(e) => update("languagesSpoken", e.target.value)} />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" rows={3} value={form.bio} onChange={(e) => update("bio", e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-3">
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : isEdit ? "Update Member" : "Add Member"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
