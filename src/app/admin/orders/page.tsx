import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";
import { OrdersTable } from "./OrdersTable";
import Link from "next/link";

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; q?: string }>;
}) {
  try {
    await auth();
    const params = await searchParams;
    const page = Math.max(1, parseInt(params.page || "1") || 1);
    const limit = 20;
    await connectDB();

    // ── Build filter ──
    const filter: Record<string, unknown> = {};

    if (params.status && params.status !== "all") {
      filter.status = params.status;
    } else if (!params.status) {
      filter.$or = [
        { paymentStatus: "paid" },
        { paymentStatus: "refunded" },
        { status: { $in: ["paid", "processing", "shipped", "delivered", "cancelled"] } },
      ];
    }

    const searchQ = params.q?.trim();
    if (searchQ) {
      const escaped = escapeRegex(searchQ);
      const searchFilter = [
        { "shippingAddress.name": { $regex: escaped, $options: "i" } },
        { "shippingAddress.phone": { $regex: escaped, $options: "i" } },
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or as unknown[] }, { $or: searchFilter }];
        delete filter.$or;
      } else {
        filter.$or = searchFilter;
      }
    }

    const [data, total, pendingCount] = await Promise.all([
      Order.find(filter)
        .select("items totalAmount status paymentStatus shippingAddress trackingId razorpayPaymentId delhiveryWaybill createdAt userId")
        .populate({ path: "userId", select: "phone name", strictPopulate: false })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
      Order.countDocuments({ status: "created", paymentStatus: "pending" }),
    ]);

    const serialized = JSON.parse(JSON.stringify(data ?? []));
    const currentStatus = params.status || "";

    return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Orders</h1>
          <p className="mt-1 text-sm text-gray-500">Track, update status, and manage customer orders</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
              {total} shown
            </span>
            {pendingCount > 0 && !currentStatus && (
              <a
                href="/admin/orders?status=created"
                className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700 hover:bg-amber-200 transition-colors"
              >
                ⏳ {pendingCount} pending
              </a>
            )}
          </div>
        </div>
      </div>
      <OrdersTable data={serialized} total={total} page={page} />
    </div>
  );
  } catch (err) {
    console.error("[Admin Orders] Server error:", err);
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800">Unable to load orders</h2>
          <p className="mt-2 text-sm text-red-600">
            A temporary error occurred. Please try again in a moment.
          </p>
          <Link
            href="/admin/orders"
            className="mt-4 inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Retry
          </Link>
        </div>
      </div>
    );
  }
}
