"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Star, Search, Clock, CheckCircle2, XCircle, PhoneCall } from "lucide-react";

interface AstroRequest {
    _id: string;
    name: string;
    email: string;
    phone: string;
    problemCategory: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    status: string;
    notes: string;
    createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
    requested: { label: "New Request", cls: "bg-amber-100 text-amber-700" },
    assigned: { label: "Assigned", cls: "bg-blue-100 text-blue-700" },
    confirmed: { label: "Confirmed", cls: "bg-indigo-100 text-indigo-700" },
    completed: { label: "Completed", cls: "bg-emerald-100 text-emerald-700" },
    cancelled: { label: "Cancelled", cls: "bg-red-100 text-red-700" },
};

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="text-xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );
}

export function AstrologyClient({
    requests,
    total,
    pending,
}: {
    requests: AstroRequest[];
    total: number;
    pending: number;
}) {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const filtered = useMemo(() => {
        return requests.filter((r) => {
            const matchSearch =
                !search ||
                r.name.toLowerCase().includes(search.toLowerCase()) ||
                r.email.toLowerCase().includes(search.toLowerCase()) ||
                r.phone.includes(search) ||
                r.problemCategory.toLowerCase().includes(search.toLowerCase());
            const matchStatus = filterStatus === "all" || r.status === filterStatus;
            return matchSearch && matchStatus;
        });
    }, [requests, search, filterStatus]);

    const completed = requests.filter((r) => r.status === "completed").length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-heading text-3xl font-bold text-gray-900">Astrology Requests</h1>
                <p className="text-gray-500 text-sm mt-1">
                    {total} total · {pending} pending · {completed} completed
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={Star} label="Total Requests" value={total} color="bg-amber-50 text-amber-600" />
                <StatCard icon={Clock} label="Pending" value={pending} color="bg-orange-50 text-orange-600" />
                <StatCard icon={CheckCircle2} label="Completed" value={completed} color="bg-emerald-50 text-emerald-600" />
                <StatCard icon={XCircle} label="Cancelled" value={requests.filter(r => r.status === "cancelled").length} color="bg-red-50 text-red-600" />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, email, phone or category..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                >
                    <option value="all">All Status</option>
                    {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <Star className="w-12 h-12 mb-3 opacity-30" />
                        <p className="font-medium">No astrology requests found</p>
                        <p className="text-sm mt-1">
                            {search ? "Try adjusting your search" : "Requests from users will appear here"}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-gray-600">Date</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">Customer</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">Category</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">Birth Details</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((req) => {
                                    const statusCfg = STATUS_CONFIG[req.status] || { label: req.status, cls: "bg-gray-100 text-gray-700" };
                                    return (
                                        <tr key={req._id} className="hover:bg-gray-50/70 transition-colors align-top">
                                            <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                                                {format(new Date(req.createdAt), "dd MMM yyyy")}
                                                <br />
                                                <span className="text-gray-400">{format(new Date(req.createdAt), "HH:mm")}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                                        {req.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{req.name}</p>
                                                        <p className="text-xs text-gray-500">{req.email}</p>
                                                        <p className="text-xs text-gray-500">{req.phone}</p>
                                                    </div>
                                                </div>
                                                {req.notes && (
                                                    <p className="mt-1.5 text-xs text-gray-400 italic max-w-[220px] line-clamp-2 bg-gray-50 rounded px-2 py-1">
                                                        &quot;{req.notes}&quot;
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                                                    {req.problemCategory}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-xs text-gray-700 space-y-0.5">
                                                    <p><span className="font-medium text-gray-500">DOB:</span> {format(new Date(req.birthDate), "dd MMM yyyy")}</p>
                                                    {req.birthTime && <p><span className="font-medium text-gray-500">Time:</span> {req.birthTime}</p>}
                                                    <p><span className="font-medium text-gray-500">Place:</span> {req.birthPlace}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.cls}`}>
                                                    {statusCfg.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <a
                                                    href={`tel:${req.phone}`}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors text-xs font-semibold"
                                                >
                                                    <PhoneCall className="w-3.5 h-3.5" />
                                                    Call
                                                </a>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
                            Showing {filtered.length} of {total} requests
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
