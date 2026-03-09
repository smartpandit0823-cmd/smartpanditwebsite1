import { getDashboardStats } from "@/services/analytics.service";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AnalyticsClient } from "./AnalyticsClient";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Analytics | Admin",
};

export default async function AdminAnalyticsPage() {
    const session = await auth();
    if (!session?.user) redirect("/admin/login");

    // Fetch 30-day stats for deep analytics
    const stats = await getDashboardStats("30d");

    // Format data for charts
    const revenueData = stats.revenueByDay.map((d) => ({
        date: d.date,
        revenue: (d.puja || 0) + (d.store || 0) + (d.astrology || 0),
        puja: d.puja || 0,
        store: d.store || 0,
        astrology: d.astrology || 0,
    }));

    const bookingTrend = stats.bookingTrend || [];
    const trafficTrend = stats.trafficTrend || [];

    const conversionSummary = stats.conversionSummary || { visitors: 0, bookings: 0, rate: 0 };

    return (
        <AnalyticsClient
            revenueData={revenueData}
            bookingTrend={bookingTrend}
            trafficTrend={trafficTrend}
            conversionSummary={conversionSummary}
            topProducts={stats.topProducts}
        />
    );
}


