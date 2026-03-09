"use client";

import Link from "next/link";
import {
    IndianRupee,
    ShoppingCart,
    Package,
    AlertTriangle,
    ArrowUpRight,
    TrendingUp,
    Plus,
    Image,
    Ticket,
    Gift,
    Truck,
    Users,
    Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DashboardData {
    totalRevenue: number;
    storeRevenue: number;
    pujaRevenue: number;
    astrologyRevenue: number;
    totalOrders: number;
    totalRealOrders: number;
    totalCustomers: number;
    pendingAstroRequests: number;
    totalUsers: number;
    totalBookings: number;
    todayBookings: number;
    pendingAssignments: number;
    pendingReviews: number;
    revenueByDay: { date: string; revenue: number }[];
    orderStatusData: { name: string; value: number }[];
    topProducts: { _id: string; name: string; totalSold: number; revenue: number }[];
    lowStockProducts: { _id: string; name: string; stock: number }[];
    conversionRate: number;
    visitors: number;
}

function formatCurrency(amount: number | undefined | null) {
    const val = Number(amount) || 0;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
    return `₹${val.toLocaleString()}`;
}

export function DashboardClient({ data }: { data: DashboardData }) {
    const statCards = [
        {
            title: "Total Revenue",
            value: formatCurrency(data.totalRevenue),
            icon: IndianRupee,
            change: "+12.5%",
            color: "from-emerald-500 to-teal-600",
            bg: "bg-emerald-50",
            textColor: "text-emerald-600",
            href: "/admin/orders",
        },
        {
            title: "Total Orders",
            value: data.totalRealOrders.toString(),
            icon: ShoppingCart,
            change: "",
            color: "from-blue-500 to-indigo-600",
            bg: "bg-blue-50",
            textColor: "text-blue-600",
            href: "/admin/orders",
        },
        {
            title: "Customers",
            value: data.totalCustomers.toString(),
            icon: Users,
            change: "",
            color: "from-purple-500 to-violet-600",
            bg: "bg-purple-50",
            textColor: "text-purple-600",
            href: "/admin/customers",
        },
        {
            title: "Astro Requests",
            value: data.pendingAstroRequests.toString(),
            icon: Star,
            change: "",
            color: "from-amber-500 to-orange-600",
            bg: "bg-amber-50",
            textColor: "text-amber-600",
            href: "/admin/astrology-requests",
        },
    ];

    const quickActions = [
        { label: "Add Product", href: "/admin/products/new", icon: Plus, color: "bg-saffron-600 hover:bg-saffron-700" },
        { label: "Add Banner", href: "/admin/banners/new", icon: Image, color: "bg-blue-600 hover:bg-blue-700" },
        { label: "Create Coupon", href: "/admin/coupons", icon: Ticket, color: "bg-purple-600 hover:bg-purple-700" },
        { label: "Add Combo", href: "/admin/combos", icon: Gift, color: "bg-emerald-600 hover:bg-emerald-700" },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Welcome back! Here&apos;s your store overview.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Link key={stat.title} href={stat.href || "#"}>
                            <Card className="relative overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.title}</p>
                                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                            {stat.change && (
                                                <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
                                                    <ArrowUpRight size={12} /> {stat.change}
                                                </p>
                                            )}
                                        </div>
                                        <div className={`${stat.bg} p-2.5 rounded-xl`}>
                                            <Icon size={20} className={stat.textColor} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <Link key={action.label} href={action.href}>
                                    <Button className={`w-full ${action.color} text-white gap-2 h-auto py-3`}>
                                        <Icon size={16} />
                                        <span className="text-sm">{action.label}</span>
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Top Products */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Package size={16} /> Top 5 Products
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data.topProducts && data.topProducts.length > 0 ? (
                            <div className="space-y-3">
                                {data.topProducts.slice(0, 5).map((product, i) => (
                                    <div key={product._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-saffron-100 to-amber-100 text-sm font-bold text-saffron-700">
                                            #{i + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                                            <p className="text-xs text-gray-500">{product.totalSold} sold</p>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {formatCurrency(product.revenue)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 py-8 text-center">No products sold yet</p>
                        )}
                    </CardContent>
                </Card>

                {/* Low Stock Alerts */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <AlertTriangle size={16} className="text-amber-500" /> Low Stock Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data.lowStockProducts && data.lowStockProducts.length > 0 ? (
                            <div className="space-y-3">
                                {data.lowStockProducts.map((product) => (
                                    <div key={product._id} className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50 border border-amber-100">
                                        <span className="text-sm font-medium text-gray-900 truncate">{product.name}</span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${product.stock === 0 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                                            }`}>
                                            {product.stock === 0 ? "Out of Stock" : `${product.stock} left`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 py-8 text-center">All products well stocked ✅</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Revenue Chart Placeholder */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Revenue Trend (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                    {data.revenueByDay && data.revenueByDay.length > 0 ? (
                        <div className="flex items-end gap-2 h-40">
                            {data.revenueByDay.map((day, i) => {
                                const maxRev = Math.max(...data.revenueByDay.map((d) => Number(d.revenue) || 0), 1);
                                const rev = Number(day.revenue) || 0;
                                const height = Math.max((rev / maxRev) * 100, 4);
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <div
                                            className="w-full bg-gradient-to-t from-saffron-500 to-amber-400 rounded-t-lg transition-all hover:opacity-80"
                                            style={{ height: `${height}%` }}
                                            title={`₹${rev.toLocaleString()}`}
                                        />
                                        <span className="text-[9px] text-gray-400 font-medium">
                                            {new Date(day.date).toLocaleDateString("en-IN", { weekday: "short" })}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-40 flex items-center justify-center text-sm text-gray-400">
                            No revenue data available
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
