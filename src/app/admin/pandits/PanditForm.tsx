"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export function PanditForm({ initialData }: { initialData?: Record<string, any> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        email: initialData?.email || "",
        phone: initialData?.phone || "",
        city: initialData?.city || "",
        state: initialData?.state || "",
        experience: initialData?.experience || 0,
        status: initialData?.status || "active",
        verificationStatus: initialData?.verificationStatus || "verified",
        specializations: initialData?.specializations || [],
        languagesSpoken: initialData?.languagesSpoken || [],
    });

    const handleChange = (field: string, value: string | number | string[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const url = initialData ? `/api/admin/pandits/${initialData._id}` : `/api/admin/pandits`;
        const method = initialData ? "PATCH" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        setLoading(false);
        if (res.ok) {
            router.push("/admin/pandits");
            router.refresh();
        } else {
            alert("Failed to save pandit");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>Basic Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input required value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" required value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone (with country code)</Label>
                            <Input required value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="+91..." />
                        </div>
                        <div className="space-y-2">
                            <Label>Experience (Years)</Label>
                            <Input type="number" required value={formData.experience} onChange={(e) => handleChange("experience", Number(e.target.value))} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Area / Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>City / Area</Label>
                            <Input required value={formData.city} onChange={(e) => handleChange("city", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>State</Label>
                            <Input required value={formData.state} onChange={(e) => handleChange("state", e.target.value)} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Skills & Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Specializations (e.g. Vedic, Vastu, Marriage)</Label>
                        <TagsInput value={formData.specializations} onChange={(v) => handleChange("specializations", v)} placeholder="Add skill..." />
                    </div>
                    <div className="space-y-2">
                        <Label>Languages Spoken</Label>
                        <TagsInput value={formData.languagesSpoken} onChange={(v) => handleChange("languagesSpoken", v)} placeholder="Add language..." />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Account Status (Active Toggle)</Label>
                            <Select value={formData.status} onValueChange={(v) => handleChange("status", v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Verification</Label>
                            <Select value={formData.verificationStatus} onValueChange={(v) => handleChange("verificationStatus", v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="verified">Verified</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-saffron-600 hover:bg-saffron-700">
                    {loading ? "Saving..." : initialData ? "Update Pandit" : "Add Pandit"}
                </Button>
            </div>
        </form>
    );
}
