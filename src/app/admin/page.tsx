import { getDashboardStats } from "@/services/analytics.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/index";
import {
  Flame,
  Users,
  CalendarCheck,
  IndianRupee,
  ShoppingCart,
  Star,
  Clock,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RevenueChart, BookingTrendChart } from "./DashboardCharts";
import { RevenueBreakdownCard } from "./RevenueBreakdownCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats("7d");

  const totalRevenue = stats.pujaRevenue + stats.storeRevenue + stats.astrologyRevenue;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-warm-900">Dashboard</h1>
          <p className="mt-0.5 text-sm text-gray-500">Real-time overview of SmartPandit</p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm">
            <Link href="/admin/pujas/new">+ New Puja</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/bookings?status=paid">Pending Bookings</Link>
          </Button>
        </div>
      </div>

      {/* ══════════ Row 1: Key Numbers ══════════ */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 col-span-2 lg:col-span-1">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Total Revenue</p>
              <div className="rounded-full bg-green-100 p-1.5"><IndianRupee className="h-4 w-4 text-green-600" /></div>
            </div>
            <p className="mt-2 text-3xl font-black text-green-800">{formatCurrency(totalRevenue)}</p>
            <p className="mt-1 text-[11px] text-green-600">All sources combined</p>
          </CardContent>
        </Card>

        {/* Total Bookings */}
        <Link href="/admin/bookings">
          <Card className="hover:shadow-md transition-shadow h-full">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Bookings</p>
                <div className="rounded-full bg-saffron-50 p-1.5"><CalendarCheck className="h-4 w-4 text-saffron-600" /></div>
              </div>
              <p className="mt-2 text-3xl font-black text-warm-900">{stats.totalBookings}</p>
              <p className="mt-1 flex items-center text-[11px] text-gray-400">View all <ArrowUpRight className="ml-0.5 h-3 w-3" /></p>
            </CardContent>
          </Card>
        </Link>

        {/* Today Bookings */}
        <Link href="/admin/bookings">
          <Card className="hover:shadow-md transition-shadow h-full">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Today</p>
                <div className="rounded-full bg-amber-50 p-1.5"><Clock className="h-4 w-4 text-amber-600" /></div>
              </div>
              <p className="mt-2 text-3xl font-black text-warm-900">{stats.todayBookings}</p>
              <p className="mt-1 text-[11px] text-gray-400">Bookings today</p>
            </CardContent>
          </Card>
        </Link>

        {/* Registered Users */}
        <Link href="/admin/users">
          <Card className="hover:shadow-md transition-shadow h-full">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Users</p>
                <div className="rounded-full bg-blue-50 p-1.5"><Users className="h-4 w-4 text-blue-600" /></div>
              </div>
              <p className="mt-2 text-3xl font-black text-warm-900">{stats.totalUsers}</p>
              <p className="mt-1 flex items-center text-[11px] text-gray-400">Registered <ArrowUpRight className="ml-0.5 h-3 w-3" /></p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Pending Assignments Alert */}
      {stats.pendingAssignments > 0 && (
        <Link href="/admin/bookings?status=paid">
          <Card className="border-red-200 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-3 py-3">
              <div className="rounded-full bg-red-100 p-2"><AlertCircle className="h-5 w-5 text-red-600" /></div>
              <div>
                <p className="text-sm font-bold text-red-800">{stats.pendingAssignments} bookings need pandit assignment</p>
                <p className="text-xs text-red-600">Click to assign →</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      )}

      {/* ══════════ Revenue Breakdown (Expandable) ══════════ */}
      <RevenueBreakdownCard
        pujaRevenue={stats.pujaRevenue}
        storeRevenue={stats.storeRevenue}
        astrologyRevenue={stats.astrologyRevenue}
        totalAdvanceCollected={stats.totalAdvanceCollected}
        totalPendingCollection={stats.totalPendingCollection}
        advanceBookings={stats.advanceBookings}
        fullPaymentBookings={stats.fullPaymentBookings}
        totalRevenue={totalRevenue}
      />

      {/* ══════════ Charts ══════════ */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue (Last 7 Days)</CardTitle>
            <CardDescription className="text-xs">Daily breakdown by source</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart data={stats.revenueByDay} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Booking Trend</CardTitle>
            <CardDescription className="text-xs">New bookings per day</CardDescription>
          </CardHeader>
          <CardContent>
            <BookingTrendChart data={stats.bookingTrend} />
          </CardContent>
        </Card>
      </div>

      {/* ══════════ Top Pujas + Products ══════════ */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Pujas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.topPujas.length ? (
                stats.topPujas.map((puja, i) => (
                  <div key={puja._id} className="flex items-center justify-between rounded-lg border border-gold-100 p-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-saffron-100 text-xs font-bold text-saffron-700">{i + 1}</span>
                      <span className="text-sm font-medium">{puja.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px]">{puja.count}</Badge>
                      <span className="text-xs font-bold text-saffron-600">{formatCurrency(puja.revenue)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-6 text-center text-sm text-gray-400">No completed bookings yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.topProducts.length ? (
                stats.topProducts.map((product, i) => (
                  <div key={product._id} className="flex items-center justify-between rounded-lg border border-gold-100 p-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">{i + 1}</span>
                      <span className="text-sm font-medium">{product.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px]">{product.sold} sold</Badge>
                      <span className="text-xs font-bold text-emerald-600">{formatCurrency(product.revenue)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-6 text-center text-sm text-gray-400">No products sold yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ══════════ Pandit + Stock ══════════ */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Pandit Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.panditPerformance.length ? (
                stats.panditPerformance.map((p) => (
                  <div key={p._id} className="flex items-center justify-between rounded-lg border border-gold-100 p-3">
                    <span className="text-sm font-medium">{p.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px]">{p.completed} done</Badge>
                      <span className="text-xs text-gold-600 font-bold">★ {p.rating.toFixed(1)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-6 text-center text-sm text-gray-400">No pandit data yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.lowStockProducts.length ? (
                stats.lowStockProducts.map((p) => (
                  <Link key={p._id} href={`/admin/products/${p._id}`}>
                    <div className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50/50 p-3 hover:bg-red-50">
                      <span className="text-sm font-medium">{p.name}</span>
                      <Badge variant="destructive" className="text-[10px]">Stock: {p.stock}</Badge>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="py-6 text-center text-sm text-gray-400">All products well stocked ✓</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm"><Link href="/admin/pujas/new">+ New Puja</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href="/admin/products/new">+ New Product</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href="/admin/bookings">All Bookings</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href="/admin/pandits">Pandits</Link></Button>
      </div>
    </div>
  );
}
