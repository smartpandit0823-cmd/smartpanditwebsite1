"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Warehouse, CheckCircle2, XCircle, Truck, MapPin } from "lucide-react";

export function WarehouseManager() {
    const [form, setForm] = useState({
        name: "",
        address: "",
        city: "",
        pin: "",
        state: "",
        phone: "",
        email: "",
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    const handleSubmit = async () => {
        if (!form.name || !form.address || !form.city || !form.pin || !form.state || !form.phone) {
            setResult({ success: false, message: "Please fill all required fields" });
            return;
        }
        setLoading(true);
        setResult(null);
        try {
            const res = await fetch("/api/admin/shipping/warehouse", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (data.success) {
                setResult({ success: true, message: "Warehouse registered with Delhivery! Make sure DELHIVERY_PICKUP_LOCATION in .env.local matches this name exactly." });
            } else {
                setResult({ success: false, message: data.error || "Failed to register warehouse" });
            }
        } catch {
            setResult({ success: false, message: "Network error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Truck className="h-5 w-5 text-blue-600" />
                    Delhivery Shipping
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                {/* Current Config Info */}
                <div className="rounded-xl bg-white border border-blue-100 p-4 space-y-2">
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        Current Configuration
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                            <span className="text-gray-500">Pickup Location:</span>
                            <span className="ml-2 font-bold text-gray-900">
                                {process.env.NEXT_PUBLIC_DELHIVERY_PICKUP || "Set in .env.local"}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-500">Origin Pincode:</span>
                            <span className="ml-2 font-bold text-gray-900">
                                {process.env.NEXT_PUBLIC_DELHIVERY_ORIGIN || "Set in .env.local"}
                            </span>
                        </div>
                    </div>
                    <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2 border border-blue-100">
                        💡 <strong>Important:</strong> The pickup location name must <strong>exactly match</strong> the warehouse registered in Delhivery (case & space sensitive).
                        Current: <code className="bg-blue-100 px-1 rounded">DELHIVERY_PICKUP_LOCATION</code> in .env.local
                    </p>
                </div>

                {/* Register New Warehouse */}
                <details className="group">
                    <summary className="cursor-pointer text-sm font-semibold text-gray-700 flex items-center gap-2 hover:text-blue-600 transition-colors">
                        <Warehouse className="h-4 w-4" />
                        Register New Warehouse with Delhivery
                        <span className="text-xs text-gray-400 ml-auto">Click to expand</span>
                    </summary>
                    <div className="mt-4 space-y-4 animate-in slide-in-from-top-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-600">Warehouse Name *</Label>
                                <Input
                                    value={form.name}
                                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                    placeholder="e.g. SanatanSetu Spiritual Store"
                                    className="h-9 rounded-lg border-gray-200 text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-600">Phone *</Label>
                                <Input
                                    value={form.phone}
                                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                                    placeholder="9876543210"
                                    className="h-9 rounded-lg border-gray-200 text-sm"
                                />
                            </div>
                            <div className="col-span-2 space-y-1.5">
                                <Label className="text-xs font-medium text-gray-600">Full Address *</Label>
                                <Input
                                    value={form.address}
                                    onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                                    placeholder="Complete warehouse address"
                                    className="h-9 rounded-lg border-gray-200 text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-600">City *</Label>
                                <Input
                                    value={form.city}
                                    onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                                    placeholder="e.g. Lasalgaon"
                                    className="h-9 rounded-lg border-gray-200 text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-600">State *</Label>
                                <Input
                                    value={form.state}
                                    onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
                                    placeholder="e.g. Maharashtra"
                                    className="h-9 rounded-lg border-gray-200 text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-600">Pincode *</Label>
                                <Input
                                    value={form.pin}
                                    onChange={(e) => setForm((p) => ({ ...p, pin: e.target.value }))}
                                    placeholder="423401"
                                    className="h-9 rounded-lg border-gray-200 text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-600">Email</Label>
                                <Input
                                    value={form.email}
                                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                    placeholder="warehouse@example.com"
                                    className="h-9 rounded-lg border-gray-200 text-sm"
                                />
                            </div>
                        </div>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="rounded-xl bg-blue-600 hover:bg-blue-700 h-10 px-6"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Registering...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Warehouse className="h-4 w-4" />
                                    Register Warehouse
                                </span>
                            )}
                        </Button>
                    </div>
                </details>

                {/* Result */}
                {result && (
                    <div className={`p-3 rounded-xl border text-sm flex items-start gap-2 ${result.success
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-red-50 border-red-200 text-red-700"
                        }`}>
                        {result.success ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <XCircle size={16} className="shrink-0 mt-0.5" />}
                        <span>{result.message}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
