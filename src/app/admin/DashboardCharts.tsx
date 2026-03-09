"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    Legend,
    PieChart,
    Pie,
    Cell,
} from "recharts";

interface RevenueData {
    date: string;
    puja: number;
    store: number;
    astrology: number;
}

export function RevenueChart({ data }: { data: RevenueData[] }) {
    return (
        <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="gradPuja" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradStore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradAstro" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                    dataKey="date"
                    tickFormatter={(v) =>
                        new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
                    }
                    fontSize={11}
                    stroke="#94a3b8"
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    fontSize={11}
                    stroke="#94a3b8"
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip
                    contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                        padding: "12px 16px",
                    }}
                    formatter={(value: any, name: any) => [
                        `₹${Number(value).toLocaleString("en-IN")}`,
                        name,
                    ]}
                    labelFormatter={(label) =>
                        new Date(label).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
                    }
                />
                <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ paddingTop: "16px", fontSize: "12px" }}
                />
                <Area
                    type="monotone"
                    dataKey="puja"
                    stroke="#f97316"
                    strokeWidth={2.5}
                    fill="url(#gradPuja)"
                    name="Puja"
                    dot={false}
                    activeDot={{ r: 5, fill: "#f97316" }}
                />
                <Area
                    type="monotone"
                    dataKey="store"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    fill="url(#gradStore)"
                    name="Store"
                    dot={false}
                    activeDot={{ r: 5, fill: "#8b5cf6" }}
                />
                <Area
                    type="monotone"
                    dataKey="astrology"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    fill="url(#gradAstro)"
                    name="Astrology"
                    dot={false}
                    activeDot={{ r: 5, fill: "#06b6d4" }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

const ORDER_STATUS_COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#8b5cf6", "#ef4444", "#6b7280"];

interface OrderStatusData {
    name: string;
    value: number;
}

export function OrderStatusChart({ data }: { data: OrderStatusData[] }) {
    return (
        <ResponsiveContainer width="100%" height={260}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    cornerRadius={6}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                >
                    {data.map((_, i) => (
                        <Cell key={i} fill={ORDER_STATUS_COLORS[i % ORDER_STATUS_COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                        padding: "8px 14px",
                        fontSize: "13px",
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}

export function RevenueBarChart({ data }: { data: RevenueData[] }) {
    return (
        <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data} barCategoryGap="24%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                    dataKey="date"
                    tickFormatter={(v) =>
                        new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
                    }
                    fontSize={11}
                    stroke="#94a3b8"
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    fontSize={11}
                    stroke="#94a3b8"
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip
                    contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                        padding: "12px 16px",
                    }}
                    formatter={(value: any, name: any) => [
                        `₹${Number(value).toLocaleString("en-IN")}`,
                        name,
                    ]}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="puja" fill="#f97316" name="Puja" radius={[6, 6, 0, 0]} />
                <Bar dataKey="store" fill="#8b5cf6" name="Store" radius={[6, 6, 0, 0]} />
                <Bar dataKey="astrology" fill="#06b6d4" name="Astrology" radius={[6, 6, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
