import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import Booking from "@/models/Booking";
import { redirect } from "next/navigation";
import { CustomersClient } from "./CustomersClient";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  await connectDB();

  const customers = await User.find({ status: { $ne: "deleted" } })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  const total = await User.countDocuments({ status: { $ne: "deleted" } });

  const userIds = customers.map((c: any) => c._id);

  const [orderStats, bookingStats, lastOrders] = await Promise.all([
    Order.aggregate([
      { $match: { userId: { $in: userIds }, paymentStatus: "paid" } },
      {
        $group: {
          _id: "$userId",
          totalSpent: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
    ]),
    Booking.aggregate([
      {
        $match: {
          userId: { $in: userIds },
          status: { $ne: "cancelled" },
          amountPaid: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: "$userId",
          totalSpent: { $sum: "$amountPaid" },
          count: { $sum: 1 },
        },
      },
    ]),
    Order.aggregate([
      { $match: { userId: { $in: userIds }, paymentStatus: "paid" } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$userId",
          lastOrderAt: { $first: "$createdAt" },
        },
      },
    ]),
  ]);

  const orderMap = new Map(
    orderStats.map((o: any) => [o._id.toString(), o])
  );
  const bookingMap = new Map(
    bookingStats.map((b: any) => [b._id.toString(), b])
  );
  const lastOrderMap = new Map(
    lastOrders.map((l: any) => [l._id.toString(), l.lastOrderAt])
  );

  const data = customers.map((c: any) => {
    const id = c._id.toString();
    const oStats = orderMap.get(id);
    const bStats = bookingMap.get(id);
    const orderSpent = oStats?.totalSpent || 0;
    const bookingSpent = bStats?.totalSpent || 0;
    const orderCount = oStats?.count || 0;
    const bookingCount = bStats?.count || 0;
    const lastOrderAt = lastOrderMap.get(id);

    return {
      _id: id,
      name: c.name || "Unknown",
      email: c.email || "",
      phone: c.phone || "",
      status: c.status || "active",
      totalOrders: orderCount + bookingCount,
      totalSpent: orderSpent + bookingSpent,
      loyaltyPoints: 0,
      source: c.authProvider || "website",
      createdAt: c.createdAt.toISOString(),
      lastOrderAt: lastOrderAt ? lastOrderAt.toISOString() : null,
      city: c.city || "",
    };
  });

  return <CustomersClient customers={data} total={total} />;
}
