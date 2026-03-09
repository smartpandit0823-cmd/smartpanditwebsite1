"use client";

import { useState } from "react";
import { Truck, CheckCircle2, Loader2, MapPin, AlertCircle, Building2, Package, ExternalLink, CalendarDays } from "lucide-react";
import Link from "next/link";

interface Shipment {
    id: string;
    orderId: string;
    waybill: string;
    customerName: string;
    status: string;
    delhiveryStatus: string;
    createdAt: string;
    totalAmount: number;
}

export function ShippingClient({ shipments = [] }: { shipments?: Shipment[] }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<"dashboard" | "settings">("dashboard");

    const [form, setForm] = useState({
        name: "SanatanSetu Warehouse", // Should visually match the .env variable suggestion
        phone: "",
        email: "support@sanatansetu.com",
        address: "",
        city: "",
        state: "",
        pin: "",
    });

    const INDIAN_STATES = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
        "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
        "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
        "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
        "Uttar Pradesh", "Uttarakhand", "West Bengal",
        "Delhi", "Jammu & Kashmir", "Ladakh",
        "Chandigarh", "Puducherry", "Lakshadweep",
        "Andaman & Nicobar Islands", "Dadra & Nagar Haveli and Daman & Diu",
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const res = await fetch("/api/admin/shipping/warehouse", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 5000);
            } else {
                setError(typeof data?.error === "string" ? data.error : data?.error?.message || "Failed to register pickup location at Delhivery.");
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        Shipping Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage all active shipments, track packages, and configure warehouses
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 ${activeTab === "dashboard" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900"}`}
                >
                    <Package size={16} /> All Shipments
                </button>
                <button
                    onClick={() => setActiveTab("settings")}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 ${activeTab === "settings" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900"}`}
                >
                    <Building2 size={16} /> Warehouse Settings
                </button>
            </div>

            {activeTab === "dashboard" ? (
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                            <p className="text-sm font-medium text-gray-500">Total Active Shipments</p>
                            <p className="mt-2 text-3xl font-bold text-gray-900">{shipments.length}</p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Order & AWB</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Live Status</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {shipments.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                                No active shipments found.
                                            </td>
                                        </tr>
                                    ) : shipments.map((s) => (
                                        <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-900">#{s.orderId}</p>
                                                <p className="text-xs text-blue-600 font-mono mt-0.5">{s.waybill}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-700">{s.customerName}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{new Date(s.createdAt).toLocaleDateString()}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold
                                                    ${s.delhiveryStatus === "Delivered" ? "bg-emerald-50 text-emerald-700" :
                                                        s.delhiveryStatus.includes("Dispatched") || s.delhiveryStatus.includes("Transit") || s.delhiveryStatus.includes("Manifested") ? "bg-blue-50 text-blue-700" :
                                                            "bg-amber-50 text-amber-700"}`}>
                                                    {s.delhiveryStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/admin/orders/${s.id}`}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    View Order <ExternalLink size={14} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm">
                        <div className="flex items-start gap-4">
                            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shrink-0">
                                <Truck className="size-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-gray-900">Delhivery Active</h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    The system is connected to your Delhivery account. To use the &quot;Ship via Delhivery&quot; button on
                                    order details pages, your warehouse/pickup location must be registered.
                                </p>
                                <p className="mt-2 text-xs font-semibold text-blue-800 bg-blue-100 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                                    <AlertCircle size={14} /> Ensure <code className="bg-white/50 px-1 rounded">name</code> matches <code className="bg-white/50 px-1 rounded">DELHIVERY_PICKUP_LOCATION</code> in .env.local
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Building2 className="text-emerald-500" size={20} />
                            Register New Warehouse
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Warehouse Name *</label>
                                    <input
                                        required
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                        placeholder="e.g. SanatanSetu Warehouse"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                                    <input
                                        required
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                                        placeholder="10-digit phone"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Address */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700">Full Address *</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={form.address}
                                        onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                                        placeholder="Building, Street, Landmark"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                                    />
                                </div>

                                {/* City */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">City *</label>
                                    <input
                                        required
                                        type="text"
                                        value={form.city}
                                        onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                                        placeholder="City"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>

                                {/* State */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">State *</label>
                                    <select
                                        required
                                        value={form.state}
                                        onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
                                        className={`w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none bg-white ${!form.state ? "text-gray-400" : "text-gray-900"}`}
                                    >
                                        <option value="" disabled>Select State</option>
                                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                {/* Pincode & Email */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Pincode *</label>
                                    <input
                                        required
                                        type="text"
                                        maxLength={6}
                                        value={form.pin}
                                        onChange={(e) => setForm((p) => ({ ...p, pin: e.target.value.replace(/\D/g, "") }))}
                                        placeholder="6-digit PIN"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                        placeholder="support@domain.com"
                                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">
                                    ❌ {error}
                                </div>
                            )}

                            {success && (
                                <div className="p-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
                                    <CheckCircle2 size={16} /> Warehouse registered successfully!
                                </div>
                            )}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-gray-900 text-white font-bold h-11 px-8 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {loading ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
                                    {loading ? "Registering..." : "Register Warehouse"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
