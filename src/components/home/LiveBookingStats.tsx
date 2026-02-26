"use client";

import { useState, useEffect } from "react";
import { CalendarCheck, Flame, Users } from "lucide-react";

interface LiveStats {
    totalBookings: number;
    todayBookings: number;
    activePandits: number;
}

export function LiveBookingStats() {
    const [stats, setStats] = useState<LiveStats | null>(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/stats/live");
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch {
                // Silent fail
            }
        }
        fetchStats();
        // Refresh every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    if (!stats || stats.totalBookings === 0) return null;

    return (
        <section className="mx-auto max-w-7xl px-4 py-6">
            <div className="rounded-2xl bg-gradient-to-r from-saffron-50 via-gold-50 to-orange-50 border border-saffron-200/60 p-5">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-xs font-bold text-saffron-700 uppercase tracking-wider">Live Stats</p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                            <CalendarCheck size={16} className="text-saffron-500" />
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-warm-900">{stats.totalBookings.toLocaleString("en-IN")}+</p>
                        <p className="text-[10px] sm:text-xs text-warm-500 font-medium mt-0.5">Total Bookings</p>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                            <Flame size={16} className="text-orange-500" />
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-warm-900">{stats.todayBookings}</p>
                        <p className="text-[10px] sm:text-xs text-warm-500 font-medium mt-0.5">Today Bookings</p>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                            <Users size={16} className="text-green-500" />
                        </div>
                        <p className="text-2xl sm:text-3xl font-black text-warm-900">{stats.activePandits}</p>
                        <p className="text-[10px] sm:text-xs text-warm-500 font-medium mt-0.5">Active Pandits</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
