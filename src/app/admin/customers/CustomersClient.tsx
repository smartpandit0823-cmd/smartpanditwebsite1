"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
    Users, Search, IndianRupee, ShoppingBag,
    CheckCircle2, XCircle, MapPin, Globe
} from "lucide-react";

interface Customer {
    _id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    totalOrders: number;
    totalSpent: number;
    loyaltyPoints: number;
    source: string;
    createdAt: string;
    lastOrderAt: string | null;
    city: string;
}

function formatCurrency(v: number) {
    if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
    if (v >= 1000) return `₹${(v / 1000).toFixed(1)}K`;
    return `₹${v.toLocaleString("en-IN")}`;
}

export function CustomersClient({ customers, total }: { customers: Customer[]; total: number }) {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    const filtered = useMemo(() => {
        return customers.filter((c) => {
            const matchSearch =
                !search ||
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.email.toLowerCase().includes(search.toLowerCase()) ||
                c.phone.includes(search);
            const matchStatus = filterStatus === "all" || c.status === filterStatus;
            return matchSearch && matchStatus;
        });
    }, [customers, search, filterStatus]);

    const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
    const activeCount = customers.filter((c) => c.status === "active").length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-heading text-3xl font-bold text-gray-900">Customers</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {total} total customers · {activeCount} active
                    </p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={Users} label="Total Customers" value={total.toString()} color="bg-blue-50 text-blue-600" />
                <StatCard icon={CheckCircle2} label="Active" value={activeCount.toString()} color="bg-emerald-50 text-emerald-600" />
                <StatCard icon={IndianRupee} label="Total Revenue" value={formatCurrency(totalRevenue)} color="bg-orange-50 text-orange-600" />
                <StatCard icon={ShoppingBag} label="With Orders" value={customers.filter(c => c.totalOrders > 0).length.toString()} color="bg-purple-50 text-purple-600" />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, email or phone..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                        <Users className="w-12 h-12 mb-3 opacity-30" />
                        <p className="font-medium">No customers found</p>
                        <p className="text-sm mt-1">
                            {search ? "Try adjusting your search" : "Customers will appear here when they register"}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-gray-600">Customer</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">Contact</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600 text-center">Orders</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600 text-right">Total Spent</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">Last Order</th>
                                    <th className="px-4 py-3 font-semibold text-gray-600">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((c) => (
                                    <tr key={c._id} className="hover:bg-gray-50/70 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                                    {c.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{c.name}</p>
                                                    {c.city && (
                                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />{c.city}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-gray-700">{c.email}</p>
                                            <p className="text-xs text-gray-500">{c.phone || "—"}</p>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-700 font-bold text-xs">
                                                {c.totalOrders}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold text-gray-900">
                                            {formatCurrency(c.totalSpent)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${c.status === "active"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : c.status === "blocked"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-gray-100 text-gray-700"
                                                }`}>
                                                {c.status === "active" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">
                                            {c.lastOrderAt ? format(new Date(c.lastOrderAt), "dd MMM yyyy") : "—"}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">
                                            {format(new Date(c.createdAt), "dd MMM yyyy")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
                            Showing {filtered.length} of {total} customers
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} bg-opacity-20`}>
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
