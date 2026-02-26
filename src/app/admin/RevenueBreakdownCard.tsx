"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/index";
import { ChevronDown, ChevronUp, Flame, ShoppingCart, Star, Wallet, IndianRupee, CheckCircle2 } from "lucide-react";

interface RevenueBreakdownCardProps {
    pujaRevenue: number;
    storeRevenue: number;
    astrologyRevenue: number;
    totalAdvanceCollected: number;
    totalPendingCollection: number;
    advanceBookings: number;
    fullPaymentBookings: number;
    totalRevenue: number;
}

export function RevenueBreakdownCard({
    pujaRevenue,
    storeRevenue,
    astrologyRevenue,
    totalAdvanceCollected,
    totalPendingCollection,
    advanceBookings,
    fullPaymentBookings,
    totalRevenue,
}: RevenueBreakdownCardProps) {
    const [expanded, setExpanded] = useState(false);

    // Pie chart values
    const segments = [
        { label: "Puja", amount: pujaRevenue, color: "#e87c3f", icon: Flame },
        { label: "Store", amount: storeRevenue, color: "#10b981", icon: ShoppingCart },
        { label: "Astrology", amount: astrologyRevenue, color: "#8b5cf6", icon: Star },
    ].filter((s) => s.amount > 0);

    const totalReceived = totalAdvanceCollected + (totalRevenue - totalAdvanceCollected - totalPendingCollection);

    return (
        <Card className="overflow-hidden">
            {/* Click to expand header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full text-left"
            >
                <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-gradient-to-br from-saffron-100 to-gold-100 p-3">
                            <IndianRupee className="h-5 w-5 text-saffron-700" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Revenue Breakdown</p>
                            <p className="text-xl font-bold text-warm-900">{formatCurrency(totalRevenue)}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Mini indicators */}
                        <div className="hidden sm:flex items-center gap-3">
                            {segments.map((s) => (
                                <div key={s.label} className="flex items-center gap-1.5">
                                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                                    <span className="text-xs text-gray-500">{s.label}</span>
                                    <span className="text-xs font-bold text-warm-900">{formatCurrency(s.amount)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-full bg-warm-100 p-1">
                            {expanded ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
                        </div>
                    </div>
                </CardContent>
            </button>

            {/* Expanded details */}
            {expanded && (
                <div className="border-t border-warm-100 bg-warm-50/50 px-6 pb-6 pt-4">
                    <div className="grid gap-6 md:grid-cols-2">

                        {/* Left: Revenue by Source */}
                        <div>
                            <h4 className="text-sm font-bold text-warm-900 mb-3">💰 Revenue by Source</h4>
                            <div className="space-y-3">
                                {/* Puja */}
                                <div className="flex items-center justify-between rounded-xl bg-white border border-warm-100 p-3">
                                    <div className="flex items-center gap-2">
                                        <div className="rounded-full bg-orange-100 p-1.5"><Flame className="h-4 w-4 text-orange-500" /></div>
                                        <span className="text-sm font-medium text-warm-800">Puja Bookings</span>
                                    </div>
                                    <span className="text-sm font-bold text-warm-900">{formatCurrency(pujaRevenue)}</span>
                                </div>

                                {/* Store */}
                                <div className="flex items-center justify-between rounded-xl bg-white border border-warm-100 p-3">
                                    <div className="flex items-center gap-2">
                                        <div className="rounded-full bg-emerald-100 p-1.5"><ShoppingCart className="h-4 w-4 text-emerald-500" /></div>
                                        <span className="text-sm font-medium text-warm-800">Store Orders</span>
                                    </div>
                                    <span className="text-sm font-bold text-warm-900">{formatCurrency(storeRevenue)}</span>
                                </div>

                                {/* Astrology */}
                                <div className="flex items-center justify-between rounded-xl bg-white border border-warm-100 p-3">
                                    <div className="flex items-center gap-2">
                                        <div className="rounded-full bg-purple-100 p-1.5"><Star className="h-4 w-4 text-purple-500" /></div>
                                        <span className="text-sm font-medium text-warm-800">Astrology</span>
                                    </div>
                                    <span className="text-sm font-bold text-warm-900">{formatCurrency(astrologyRevenue)}</span>
                                </div>
                            </div>

                            {/* Visual bar */}
                            {totalRevenue > 0 && (
                                <div className="mt-4">
                                    <div className="flex h-3 rounded-full overflow-hidden bg-warm-100">
                                        {segments.map((s) => (
                                            <div
                                                key={s.label}
                                                className="h-full transition-all"
                                                style={{
                                                    backgroundColor: s.color,
                                                    width: `${(s.amount / totalRevenue) * 100}%`,
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-1.5">
                                        {segments.map((s) => (
                                            <span key={s.label} className="text-[10px] text-gray-400">
                                                {s.label} ({Math.round((s.amount / totalRevenue) * 100)}%)
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Payment Status */}
                        <div>
                            <h4 className="text-sm font-bold text-warm-900 mb-3">💳 Payment Status</h4>
                            <div className="space-y-3">
                                {/* Received */}
                                <div className="rounded-xl bg-green-50 border border-green-200 p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            <span className="text-sm font-medium text-green-800">Received</span>
                                        </div>
                                        <span className="text-lg font-bold text-green-700">{formatCurrency(totalReceived)}</span>
                                    </div>
                                    <p className="text-[11px] text-green-600 mt-1">
                                        {fullPaymentBookings} full payment + {advanceBookings} advance
                                    </p>
                                </div>

                                {/* Pending */}
                                {totalPendingCollection > 0 && (
                                    <div className="rounded-xl bg-orange-50 border border-orange-200 p-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Wallet className="h-4 w-4 text-orange-600" />
                                                <span className="text-sm font-medium text-orange-800">Pending Collection</span>
                                            </div>
                                            <span className="text-lg font-bold text-orange-700">{formatCurrency(totalPendingCollection)}</span>
                                        </div>
                                        <p className="text-[11px] text-orange-600 mt-1">
                                            Remaining from {advanceBookings} advance bookings (pandit will collect)
                                        </p>
                                    </div>
                                )}

                                {/* Advance Details */}
                                {advanceBookings > 0 && (
                                    <div className="rounded-xl bg-white border border-warm-100 p-3">
                                        <p className="text-xs font-semibold text-gray-500 mb-2">ADVANCE BREAKDOWN</p>
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Advance Received</span>
                                                <span className="font-bold text-green-700">{formatCurrency(totalAdvanceCollected)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Yet to Collect</span>
                                                <span className="font-bold text-orange-600">{formatCurrency(totalPendingCollection)}</span>
                                            </div>
                                            <hr className="border-warm-100" />
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-700 font-medium">Total from Advance Bookings</span>
                                                <span className="font-bold text-warm-900">{formatCurrency(totalAdvanceCollected + totalPendingCollection)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}
