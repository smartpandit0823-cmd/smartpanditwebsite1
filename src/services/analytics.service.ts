import connectDB from "@/lib/db/mongodb";
import Booking from "@/models/Booking";
import AstrologyRequest from "@/models/AstrologyRequest";
import Order from "@/models/Order";
import Pandit from "@/models/Pandit";
import Product from "@/models/Product";
import Review from "@/models/Review";
import User from "@/models/User";
import AnalyticsEvent from "@/models/AnalyticsEvent";
import Customer from "@/models/Customer";

// ──────── Dashboard Stats (Enhanced) ────────

export interface DashboardStats {
  totalUsers: number;
  totalCustomers: number;
  totalRealOrders: number;
  pendingAstroRequests: number;
  totalVisitors: number;
  totalBookings: number;
  pujaRevenue: number;
  storeRevenue: number;
  astrologyRevenue: number;
  todayBookings: number;
  pendingAssignments: number;
  totalAdvanceCollected: number;
  totalPendingCollection: number;
  advanceBookings: number;
  fullPaymentBookings: number;
  topPujas: { _id: string; name: string; count: number; revenue: number }[];
  topProducts: { _id: string; name: string; sold: number; revenue: number }[];
  conversionSummary: { visitors: number; bookings: number; rate: number };
  revenueByDay: { date: string; puja: number; store: number; astrology: number }[];
  bookingTrend: { date: string; count: number }[];
  trafficTrend: { date: string; visitors: number; pageViews: number }[];
  panditPerformance: { _id: string; name: string; completed: number; rating: number }[];
  lowStockProducts: { _id: string; name: string; stock: number }[];
  pendingReviews: number;
}

export async function getDashboardStats(period: "7d" | "30d" = "7d"): Promise<DashboardStats> {
  await connectDB();

  const days = period === "7d" ? 7 : 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [
    totalUsers,
    totalCustomers,
    totalRealOrders,
    pendingAstroRequests,
    totalBookings,
    todayBookings,
    pendingAssignments,
    pujaRevenueResult,
    storeRevenueResult,
    astrologyRevenueResult,
    topPujas,
    topProductsRaw,
    panditPerformance,
    lowStockProducts,
    pendingReviews,
    bookingTrend,
    totalVisitors,
    trafficTrend,
  ] = await Promise.all([
    // Total users
    User.countDocuments(),
    // Total customers (registered store customers)
    Customer.countDocuments().catch(() => 0),
    // Total real orders from Order model
    Order.countDocuments().catch(() => 0),
    // Pending astrology requests
    AstrologyRequest.countDocuments({ status: "requested" }).catch(() => 0),
    // Total bookings
    Booking.countDocuments({ status: { $nin: ["cancelled"] }, amountPaid: { $gt: 0 } }),
    // Today bookings
    Booking.countDocuments({ date: { $gte: today, $lt: tomorrow }, status: { $nin: ["cancelled"] }, amountPaid: { $gt: 0 } }),
    // Pending assignments (paid but no pandit)
    Booking.countDocuments({
      status: { $in: ["requested", "paid"] },
      assignedPanditId: { $exists: false },
    }),
    // Puja revenue (from actual booking payments received minus pandit payouts)
    Booking.aggregate([
      { $match: { status: { $nin: ["cancelled"] }, amountPaid: { $gt: 0 } } },
      { $group: { _id: null, total: { $sum: { $subtract: ["$amountPaid", { $ifNull: ["$panditPayoutAmount", 0] }] } } } },
    ]),
    // Store revenue
    Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    // Astrology revenue
    AstrologyRequest.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    // Top pujas
    Booking.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: "$pujaId", count: { $sum: 1 }, revenue: { $sum: "$amount" } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: "pujas", localField: "_id", foreignField: "_id", as: "puja" } },
      { $unwind: { path: "$puja", preserveNullAndEmptyArrays: true } },
      { $project: { _id: { $toString: "$_id" }, name: { $ifNull: ["$puja.name", "Unknown"] }, count: 1, revenue: 1 } },
    ]),
    // Top products
    Product.find({ status: { $ne: "deleted" } })
      .sort({ totalSold: -1 })
      .limit(5)
      .select("name totalSold pricing.sellingPrice")
      .lean(),
    // Pandit performance
    Pandit.find({ status: "active" })
      .sort({ totalPujasCompleted: -1 })
      .limit(5)
      .select("name totalPujasCompleted averageRating")
      .lean(),
    // Low stock
    Product.find({
      status: { $ne: "deleted" },
      $expr: { $lte: ["$inventory.stock", "$inventory.lowStockThreshold"] },
    })
      .limit(5)
      .select("name inventory.stock")
      .lean(),
    // Pending reviews
    Review.countDocuments({ status: "pending" }),
    // Booking trend (per day)
    Booking.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: { $nin: ["cancelled"] } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    // Total visitors (unique sessions)
    AnalyticsEvent.distinct("sessionId", { event: "session_start" }).then((s) => s.length).catch(() => 0),
    // Traffic trend
    AnalyticsEvent.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          visitors: { $addToSet: "$sessionId" },
          pageViews: { $sum: { $cond: [{ $eq: ["$event", "page_view"] }, 1, 0] } },
        },
      },
      { $project: { _id: 1, visitors: { $size: "$visitors" }, pageViews: 1 } },
      { $sort: { _id: 1 } },
    ]).catch(() => []),
    // Advance payment stats
    Booking.aggregate([
      { $match: { paymentType: "advance", status: { $nin: ["cancelled"] } } },
      { $group: { _id: null, totalPaid: { $sum: "$amountPaid" }, totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]).catch(() => []),
    // Full payment count
    Booking.countDocuments({ paymentType: { $ne: "advance" }, status: { $nin: ["cancelled"] } }).catch(() => 0),
  ]);

  const pujaRevenue = pujaRevenueResult[0]?.total ?? 0;
  const storeRevenue = storeRevenueResult[0]?.total ?? 0;
  const astrologyRevenue = astrologyRevenueResult[0]?.total ?? 0;

  // Revenue by day (combined from transactions + orders + astrology)
  const revenueByDayMap: Record<string, { puja: number; store: number; astrology: number }> = {};

  // Fill dates
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    revenueByDayMap[key] = { puja: 0, store: 0, astrology: 0 };
  }

  // ── Secondary aggregations (run in parallel) ──
  const [pujaByDay, storeByDay, astroByDay, advanceStatsArr, fullPaymentBookings] = await Promise.all([
    // Puja revenue by day (net of payouts)
    Booking.aggregate([
      { $match: { status: { $nin: ["cancelled"] }, amountPaid: { $gt: 0 }, createdAt: { $gte: startDate } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, amount: { $sum: { $subtract: ["$amountPaid", { $ifNull: ["$panditPayoutAmount", 0] }] } } } },
    ]).catch(() => []),
    // Store revenue by day
    Order.aggregate([
      { $match: { paymentStatus: "paid", createdAt: { $gte: startDate } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, amount: { $sum: "$totalAmount" } } },
    ]).catch(() => []),
    // Astrology revenue by day
    AstrologyRequest.aggregate([
      { $match: { paymentStatus: "paid", createdAt: { $gte: startDate } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, amount: { $sum: "$amount" } } },
    ]).catch(() => []),
    // Advance payment stats
    Booking.aggregate([
      { $match: { paymentType: "advance", status: { $nin: ["cancelled"] }, amountPaid: { $gt: 0 } } },
      { $group: { _id: null, totalPaid: { $sum: "$amountPaid" }, totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]).catch(() => []),
    // Full payment count
    Booking.countDocuments({ paymentType: { $ne: "advance" }, status: { $nin: ["cancelled"] }, amountPaid: { $gt: 0 } }).catch(() => 0),
  ]);

  for (const r of pujaByDay as { _id: string; amount: number }[]) {
    if (revenueByDayMap[r._id]) revenueByDayMap[r._id].puja = r.amount;
  }
  for (const r of storeByDay as { _id: string; amount: number }[]) {
    if (revenueByDayMap[r._id]) revenueByDayMap[r._id].store = r.amount;
  }
  for (const r of astroByDay as { _id: string; amount: number }[]) {
    if (revenueByDayMap[r._id]) revenueByDayMap[r._id].astrology = r.amount;
  }

  const revenueByDay = Object.entries(revenueByDayMap).map(([date, val]) => ({ date, ...val }));
  const conversionRate = totalVisitors > 0 ? (totalBookings / totalVisitors) * 100 : 0;

  const advanceStats = advanceStatsArr as { totalPaid: number; totalAmount: number; count: number }[];
  const totalAdvanceCollected = advanceStats[0]?.totalPaid || 0;
  const totalPendingCollection = (advanceStats[0]?.totalAmount || 0) - totalAdvanceCollected;
  const advanceBookings = advanceStats[0]?.count || 0;

  return {
    totalUsers,
    totalCustomers,
    totalRealOrders,
    pendingAstroRequests,
    totalVisitors,
    totalBookings,
    pujaRevenue,
    storeRevenue,
    astrologyRevenue,
    todayBookings,
    pendingAssignments,
    totalAdvanceCollected,
    totalPendingCollection,
    advanceBookings,
    fullPaymentBookings,
    topPujas: topPujas.map((p: { _id: string; name: string; count: number; revenue: number }) => ({
      _id: p._id,
      name: p.name,
      count: p.count,
      revenue: p.revenue,
    })),
    topProducts: (topProductsRaw as { _id: unknown; name: string; totalSold: number; pricing: { sellingPrice: number } }[]).map((p) => ({
      _id: String(p._id),
      name: p.name,
      sold: p.totalSold,
      revenue: p.totalSold * (p.pricing?.sellingPrice ?? 0),
    })),
    conversionSummary: {
      visitors: totalVisitors,
      bookings: totalBookings,
      rate: parseFloat(conversionRate.toFixed(2)),
    },
    revenueByDay,
    bookingTrend: (bookingTrend as { _id: string; count: number }[]).map((b) => ({
      date: b._id,
      count: b.count,
    })),
    trafficTrend: (trafficTrend as { _id: string; visitors: number; pageViews: number }[]).map((t) => ({
      date: t._id,
      visitors: t.visitors,
      pageViews: t.pageViews,
    })),
    panditPerformance: (panditPerformance as { _id: unknown; name: string; totalPujasCompleted: number; averageRating: number }[]).map((p) => ({
      _id: String(p._id),
      name: p.name,
      completed: p.totalPujasCompleted,
      rating: p.averageRating,
    })),
    lowStockProducts: (lowStockProducts as { _id: unknown; name: string; inventory: { stock: number } }[]).map((p) => ({
      _id: String(p._id),
      name: p.name,
      stock: p.inventory?.stock ?? 0,
    })),
    pendingReviews,
  };
}
