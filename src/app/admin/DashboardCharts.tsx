"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Legend,
    AreaChart,
    Area,
} from "recharts";

interface RevenueData {
    date: string;
    puja: number;
    store: number;
    astrology: number;
}

interface BookingTrendData {
    date: string;
    count: number;
}

interface TrafficData {
    date: string;
    visitors: number;
    pageViews: number;
}

export function RevenueChart({ data }: { data: RevenueData[] }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0e6d6" />
                <XAxis
                    dataKey="date"
                    tickFormatter={(v) => new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    fontSize={12}
                    stroke="#9ca3af"
                />
                <YAxis fontSize={12} stroke="#9ca3af" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any, name: any) => [`₹${Number(value).toLocaleString("en-IN")}`, name]}
                    labelFormatter={(label) => new Date(label).toLocaleDateString("en-IN", { day: "2-digit", month: "long" })}
                />
                <Legend />
                <Bar dataKey="puja" fill="#e87c3f" name="Puja" radius={[4, 4, 0, 0]} />
                <Bar dataKey="store" fill="#d4a843" name="Store" radius={[4, 4, 0, 0]} />
                <Bar dataKey="astrology" fill="#8b5cf6" name="Astrology" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function BookingTrendChart({ data }: { data: BookingTrendData[] }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="bookingGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e87c3f" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#e87c3f" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0e6d6" />
                <XAxis
                    dataKey="date"
                    tickFormatter={(v) => new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    fontSize={12}
                    stroke="#9ca3af"
                />
                <YAxis fontSize={12} stroke="#9ca3af" />
                <Tooltip
                    labelFormatter={(label) => new Date(label).toLocaleDateString("en-IN", { day: "2-digit", month: "long" })}
                />
                <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#e87c3f"
                    strokeWidth={2}
                    fill="url(#bookingGrad)"
                    name="Bookings"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export function TrafficChart({ data }: { data: TrafficData[] }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0e6d6" />
                <XAxis
                    dataKey="date"
                    tickFormatter={(v) => new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    fontSize={12}
                    stroke="#9ca3af"
                />
                <YAxis fontSize={12} stroke="#9ca3af" />
                <Tooltip
                    labelFormatter={(label) => new Date(label).toLocaleDateString("en-IN", { day: "2-digit", month: "long" })}
                />
                <Legend />
                <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2} name="Visitors" dot={false} />
                <Line type="monotone" dataKey="pageViews" stroke="#10b981" strokeWidth={2} name="Page Views" dot={false} />
            </LineChart>
        </ResponsiveContainer>
    );
}
