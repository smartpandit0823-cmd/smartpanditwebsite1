"use client";

import { BarChart3, TrendingUp, IndianRupee, MousePointerClick, Package } from "lucide-react";
import { format } from "date-fns";

function formatCurrency(v: number) {
    if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
    if (v >= 1000) return `₹${(v / 1000).toFixed(1)}K`;
    return `₹${Math.round(v).toLocaleString("en-IN")}`;
}

interface AnalyticsClientProps {
    revenueData: any[];
    bookingTrend: any[];
    trafficTrend: any[];
    conversionSummary: any;
    topProducts: any[];
}

export function AnalyticsClient({
    revenueData,
    bookingTrend,
    trafficTrend,
    conversionSummary,
    topProducts,
}: AnalyticsClientProps) {
    // Aggregate revenue
    const totalRev = revenueData.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalStore = revenueData.reduce((acc, curr) => acc + curr.store, 0);
    const totalPuja = revenueData.reduce((acc, curr) => acc + curr.puja, 0);
    const totalAstro = revenueData.reduce((acc, curr) => acc + curr.astrology, 0);

    const maxRev = Math.max(...revenueData.map((d) => d.revenue), 1);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-heading text-3xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-500 text-sm mt-1">Deep dive into your store&apos;s 30-day performance.</p>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Total Sales 30D</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(totalRev)}</p>
                        </div>
                        <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl border border-emerald-100">
                            <IndianRupee className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <span className="text-[10px] font-medium bg-gray-100 px-2 flex items-center justify-center rounded-sm text-gray-600">Store: {formatCurrency(totalStore)}</span>
                        <span className="text-[10px] font-medium bg-gray-100 px-2 flex items-center justify-center rounded-sm text-gray-600">Puja: {formatCurrency(totalPuja)}</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Store Conversion</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">{conversionSummary.rate}%</p>
                        </div>
                        <div className="bg-blue-50 text-blue-600 p-3 rounded-xl border border-blue-100">
                            <MousePointerClick className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 font-medium">From {conversionSummary.visitors} total visitors</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Orders/Bookings</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">{conversionSummary.bookings}</p>
                        </div>
                        <div className="bg-purple-50 text-purple-600 p-3 rounded-xl border border-purple-100">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 font-medium">Successfully completed in last 30 days</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Top Product</p>
                            <p className="text-lg font-bold text-gray-900 mt-2 leading-tight truncate">
                                {topProducts[0]?.name || "N/A"}
                            </p>
                        </div>
                        <div className="bg-orange-50 text-orange-600 p-3 rounded-xl border border-orange-100 shrink-0">
                            <Package className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 font-medium">{topProducts[0]?.totalSold || 0} items sold</p>
                </div>
            </div>

            {/* Main Revenue Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-600" /> Revenue Graph (Last 30 Days)
                </h2>

                {revenueData.length > 0 ? (
                    <div className="flex items-end gap-1.5 h-64 border-b border-gray-100">
                        {revenueData.map((day, i) => {
                            const hStore = Math.max((day.store / maxRev) * 100, 0);
                            const hPuja = Math.max((day.puja / maxRev) * 100, 0);
                            const hAstro = Math.max((day.astrology / maxRev) * 100, 0);
                            const isToday = i === revenueData.length - 1;

                            return (
                                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-2 relative group cursor-crosshair">

                                    {/* Tooltip */}
                                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1.5 px-2.5 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                                        <p className="font-bold border-b border-gray-700 pb-1 mb-1">{format(new Date(day.date), "dd MMM")}</p>
                                        <p>Total: {formatCurrency(day.revenue)}</p>
                                    </div>

                                    {/* Bars Stacked */}
                                    <div className="w-full relative flex flex-col-reverse justify-start rounded-t-sm overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity" style={{ height: '90%' }}>
                                        {hStore > 0 && <div className="w-full bg-blue-500 min-h-[2px]" style={{ height: `${hStore}%` }} />}
                                        {hPuja > 0 && <div className="w-full bg-emerald-500 min-h-[2px]" style={{ height: `${hPuja}%` }} />}
                                        {hAstro > 0 && <div className="w-full bg-orange-500 min-h-[2px]" style={{ height: `${hAstro}%` }} />}
                                    </div>

                                    {/* Axis Label */}
                                    <div className="w-full text-center">
                                        <span className={`text-[9px] block -rotate-45 md:rotate-0 origin-left md:origin-center whitespace-nowrap mt-1 ${isToday ? 'text-gray-900 font-bold' : 'text-gray-400 font-medium'}`}>
                                            {format(new Date(day.date), "dd")}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">No data available</div>
                )}
                <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Store Orders</div>
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Puja Services</div>
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600"><span className="w-3 h-3 rounded-full bg-orange-500"></span> Astrologer</div>
                </div>
            </div>

        </div>
    );
}
