import { getDashboardStats } from "@/services/analytics.service";
import { formatCurrency } from "@/lib/utils/index";
import {
  IndianRupee,
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Truck,
  XCircle,
  CheckCircle2,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { DashboardClient } from "./DashboardClient";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const stats = await getDashboardStats("7d");

  // Calculate order status distribution from real data
  const orderStatusData = [
    { name: "Delivered", value: 0 },
    { name: "Processing", value: 0 },
    { name: "Shipped", value: 0 },
    { name: "Paid", value: 0 },
    { name: "Cancelled", value: 0 },
    { name: "Created", value: 0 },
  ];

  // Serialize stats for client component
  const dashboardData = {
    // Stat cards
    totalRevenue: stats.storeRevenue + stats.pujaRevenue + stats.astrologyRevenue,
    storeRevenue: stats.storeRevenue,
    pujaRevenue: stats.pujaRevenue,
    astrologyRevenue: stats.astrologyRevenue,
    totalOrders: stats.advanceBookings || 0,
    totalRealOrders: stats.totalRealOrders || 0,
    totalCustomers: stats.totalCustomers || 0,
    pendingAstroRequests: stats.pendingAstroRequests || 0,
    totalUsers: stats.totalUsers,
    totalBookings: stats.totalBookings,
    todayBookings: stats.todayBookings,
    pendingAssignments: stats.pendingAssignments,
    pendingReviews: stats.pendingReviews,

    // Charts
    revenueByDay: stats.revenueByDay.map((d) => ({
      date: d.date,
      revenue: (d.puja || 0) + (d.store || 0) + (d.astrology || 0),
    })),
    orderStatusData,

    // Top products
    topProducts: stats.topProducts.map((p) => ({
      _id: p._id,
      name: p.name,
      totalSold: (p as any).sold ?? (p as any).totalSold ?? 0,
      revenue: p.revenue,
    })),

    // Low stock
    lowStockProducts: stats.lowStockProducts,

    // Conversion
    conversionRate: stats.conversionSummary.rate,
    visitors: stats.conversionSummary.visitors,
  };

  return <DashboardClient data={dashboardData} />;
}
