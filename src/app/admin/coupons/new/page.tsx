"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, RefreshCw, Loader2, Tag, Percent, IndianRupee, Truck } from "lucide-react";
import Link from "next/link";
import { createCoupon, updateCoupon, getCoupon } from "@/actions/coupon.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function CreateCouponPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");

    const [loading, setLoading] = useState(false);
    const [initLoading, setInitLoading] = useState(!!editId);
    const [error, setError] = useState("");

    const [discountType, setDiscountType] = useState<"percentage" | "flat" | "free_shipping">("percentage");
    const [initialData, setInitialData] = useState<any>(null);

    useEffect(() => {
        if (editId) {
            getCoupon(editId).then(res => {
                if (res.success && res.coupon) {
                    setInitialData(res.coupon);
                    if (res.coupon.type) setDiscountType(res.coupon.type);
                }
                setInitLoading(false);
            });
        }
    }, [editId]);

    const generateCode = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";
        for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
        const el = document.getElementById("couponCode") as HTMLInputElement;
        if (el) el.value = `SP-${code}`;
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        formData.set("type", discountType); // ensure value is set

        const res = editId ? await updateCoupon(editId, formData) : await createCoupon(formData);
        setLoading(false);

        if (res?.error) {
            setError(res.error);
        } else {
            router.push("/admin/coupons");
            router.refresh();
        }
    }

    return (
        <div className="space-y-6 max-w-5xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/coupons">
                        <Button variant="outline" size="icon" className="h-10 w-10 bg-white shadow-sm border-gray-200">
                            <ArrowLeft size={18} className="text-gray-600" />
                        </Button>
                    </Link>
                    <div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{editId ? "Edit Coupon" : "Create New Coupon"}</h1>
                            <p className="text-sm text-gray-500 mt-1">Configure discount rules and marketing settings</p>
                        </div>
                    </div>
                </div>
            </div>

            {initLoading ? (
                <div className="flex items-center justify-center p-20">
                    <Loader2 className="animate-spin text-purple-600 size-8" />
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">

                            {/* Basic Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Details</CardTitle>
                                    <CardDescription>Internal name and customer facing code</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Coupon Code</label>
                                            <div className="flex gap-2">
                                                <Input id="couponCode" name="code" defaultValue={initialData?.code} placeholder="e.g. FESTIVAL50" className="uppercase font-mono font-bold tracking-wider" required autoFocus disabled={!!editId} />
                                                {!editId && (
                                                    <Button type="button" variant="outline" onClick={generateCode} className="shrink-0 bg-gray-50 text-gray-600 border-gray-200" title="Auto Generate">
                                                        <RefreshCw size={16} />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Internal Name</label>
                                            <Input name="name" defaultValue={initialData?.name} placeholder="e.g. Diwali 2026 Sale" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Description (Optional)</label>
                                        <Input name="description" defaultValue={initialData?.description} placeholder="Short description for admin reference" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Discount Config */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Discount Configuration</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-3 gap-3">
                                        <div
                                            onClick={() => setDiscountType("percentage")}
                                            className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${discountType === "percentage" ? "border-purple-600 bg-purple-50 ring-1 ring-purple-600" : "border-gray-200 hover:border-purple-300"}`}
                                        >
                                            <Percent size={24} className={discountType === "percentage" ? "text-purple-600" : "text-gray-400"} />
                                            <span className={`text-sm font-medium ${discountType === "percentage" ? "text-purple-700" : "text-gray-600"}`}>Percentage</span>
                                        </div>
                                        <div
                                            onClick={() => setDiscountType("flat")}
                                            className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${discountType === "flat" ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600" : "border-gray-200 hover:border-emerald-300"}`}
                                        >
                                            <IndianRupee size={24} className={discountType === "flat" ? "text-emerald-600" : "text-gray-400"} />
                                            <span className={`text-sm font-medium ${discountType === "flat" ? "text-emerald-700" : "text-gray-600"}`}>Flat Amount</span>
                                        </div>
                                        <div
                                            onClick={() => setDiscountType("free_shipping")}
                                            className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${discountType === "free_shipping" ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "border-gray-200 hover:border-blue-300"}`}
                                        >
                                            <Truck size={24} className={discountType === "free_shipping" ? "text-blue-600" : "text-gray-400"} />
                                            <span className={`text-sm font-medium ${discountType === "free_shipping" ? "text-blue-700" : "text-gray-600"}`}>Free Shipping</span>
                                        </div>
                                    </div>

                                    {discountType !== "free_shipping" && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">
                                                    {discountType === "percentage" ? "Discount Percentage (%)" : "Flat Discount (₹)"}
                                                </label>
                                                <Input name="discountValue" type="number" min="1" max={discountType === "percentage" ? "100" : undefined} defaultValue={initialData?.discountValue} placeholder={discountType === "percentage" ? "10" : "500"} required disabled={!!editId} />
                                            </div>
                                            {discountType === "percentage" && (
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700">Max Discount Cap (₹)</label>
                                                    <Input name="maxDiscountAmount" type="number" min="1" defaultValue={initialData?.maxDiscountAmount} placeholder="e.g. 1000" disabled={!!editId} />
                                                    <p className="text-[10px] text-gray-500">Leave empty for no limit</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Order Conditions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Conditions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Minimum Order Value (₹)</label>
                                            <Input name="minOrderAmount" type="number" min="0" defaultValue={initialData?.minOrderAmount || "0"} required disabled={!!editId} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Apply On</label>
                                            <select name="applicableOn" defaultValue={initialData?.applicableOn || "all"} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all" disabled={!!editId}>
                                                <option value="all">✅ All Store Products</option>
                                                <option value="products">📦 Selected Products</option>
                                                <option value="categories">📂 Selected Categories</option>
                                                <option value="purpose">🎯 Shop By Purpose (e.g. Wealth)</option>
                                                <option value="zodiac">♈ Zodiac Specific</option>
                                            </select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* User Restrictions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Usage Limits & Users</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Eligible Users</label>
                                            <select name="applyFor" defaultValue={initialData?.applyFor || "all"} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all" disabled={!!editId}>
                                                <option value="all">Everyone</option>
                                                <option value="first_time">First Time Users Only</option>
                                                <option value="specific">Specific Users</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Total Usage Limit</label>
                                            <Input name="usageLimit" type="number" min="1" defaultValue={initialData?.usageLimit || "1000"} placeholder="e.g. 500" disabled={!!editId} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Per User Limit</label>
                                            <Input name="perUserLimit" type="number" min="1" defaultValue={initialData?.perUserLimit || "1"} placeholder="e.g. 1" disabled={!!editId} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                        </div>

                        <div className="space-y-6">

                            {/* Validity Settings */}
                            <Card className="bg-gradient-to-br from-gray-50 to-white">
                                <CardHeader>
                                    <CardTitle>Validity</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Start Date</label>
                                        <Input type="datetime-local" name="startsAt" defaultValue={initialData?.startsAt ? new Date(initialData.startsAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)} required disabled={!!editId} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Expiry Date</label>
                                        <Input type="datetime-local" name="expiresAt" defaultValue={initialData?.expiresAt ? new Date(initialData.expiresAt).toISOString().slice(0, 16) : ""} required />
                                    </div>

                                    <div className="pt-2">
                                        <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition">
                                            <input type="checkbox" name="autoExpire" value="true" defaultChecked={initialData ? initialData.autoExpire : true} className="mt-1 flex-shrink-0 text-purple-600 focus:ring-purple-500 rounded bg-white shadow-sm" disabled={!!editId} />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900 leading-tight">Auto Expire</span>
                                                <span className="text-[11px] text-gray-500 mt-1">Automatically disable when date passes</span>
                                            </div>
                                        </label>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Auto Apply Settings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Auto Apply & Visibility</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/50 cursor-pointer transition">
                                        <input type="checkbox" name="autoApply" value="true" defaultChecked={initialData?.autoApply} className="text-purple-600 focus:ring-purple-500 rounded" />
                                        <span className="text-sm font-semibold text-gray-700">Auto apply in cart (No code needed)</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/50 cursor-pointer transition">
                                        <input type="checkbox" name="showBanner" value="true" defaultChecked={initialData?.showBanner} className="text-purple-600 focus:ring-purple-500 rounded" />
                                        <span className="text-sm font-semibold text-gray-700">Show success banner when applied</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/50 cursor-pointer transition">
                                        <input type="checkbox" name="showOnHome" value="true" defaultChecked={initialData?.showOnHome} className="text-purple-600 focus:ring-purple-500 rounded" />
                                        <span className="text-sm font-semibold text-gray-700">Feature on homepage</span>
                                    </label>
                                </CardContent>
                            </Card>

                            {/* Marketing Tag */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Details & Status</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {editId && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Status</label>
                                            <select name="status" defaultValue={initialData?.status || "active"} className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-semibold">
                                                <option value="active">Active</option>
                                                <option value="expired">Expired</option>
                                                <option value="disabled">Disabled</option>
                                            </select>
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Marketing Tag</label>
                                        <select name="marketingTag" defaultValue={initialData?.marketingTag || "none"} className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-semibold text-gray-700" disabled={!!editId}>
                                            <option value="none">-- None --</option>
                                            <option value="Festival">🎉 Festival</option>
                                            <option value="Clearance">⚡ Clearance</option>
                                            <option value="Influencer">🌟 Influencer</option>
                                            <option value="Referral">🤝 Referral</option>
                                            <option value="WhatsApp Campaign">💬 WhatsApp Campaign</option>
                                            <option value="Other">📌 Other</option>
                                        </select>
                                        <p className="text-[10px] text-gray-500 mt-1">Trackable marketing sources</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <div className="pt-4 flex flex-col gap-3">
                                <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold h-12 rounded-xl shadow-[0_4px_14px_rgba(147,51,234,0.39)] transition-all">
                                    {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
                                    {loading ? "Saving..." : editId ? "Update Coupon" : "Publish Coupon"}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => router.back()} className="w-full h-12 rounded-xl font-bold bg-white text-gray-600 border-gray-200 hover:bg-gray-50">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}

export default function CreateCouponPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <CreateCouponPageContent />
        </Suspense>
    );
}
