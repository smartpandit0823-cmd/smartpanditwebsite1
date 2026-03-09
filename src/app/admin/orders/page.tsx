import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";
import { OrdersTable } from "./OrdersTable";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; q?: string }>;
}) {
  await auth();
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 20;
  await connectDB();

  // ── Build filter ──
  // Default: show confirmed (paid/processing/shipped/delivered) orders
  // Only show pending/created if explicitly filtered
  const filter: Record<string, unknown> = {};

  if (params.status && params.status !== "all") {
    filter.status = params.status;
  } else if (!params.status) {
    // Default view: exclude bare "created + pending payment" orders (incomplete checkouts)
    filter.$or = [
      { paymentStatus: "paid" },
      { paymentStatus: "refunded" },
      { status: { $in: ["paid", "processing", "shipped", "delivered", "cancelled"] } },
    ];
  }
  // status === "all" → no status filter (show everything)

  if (params.q) {
    const searchFilter = [
      { "shippingAddress.name": { $regex: params.q, $options: "i" } },
      { "shippingAddress.phone": { $regex: params.q, $options: "i" } },
    ];
    if (filter.$or) {
      // Combine with existing $or using $and
      filter.$and = [{ $or: filter.$or as unknown[] }, { $or: searchFilter }];
      delete filter.$or;
    } else {
      filter.$or = searchFilter;
    }
  }

  // ── Count pending (created + pending payment) orders for the badge ──
  const [data, total, pendingCount] = await Promise.all([
    Order.find(filter)
      .select("items totalAmount status paymentStatus shippingAddress trackingId razorpayPaymentId delhiveryWaybill createdAt userId")
      .populate("userId", "phone name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
    Order.countDocuments({ status: "created", paymentStatus: "pending" }),
  ]);

  const serialized = JSON.parse(JSON.stringify(data));
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
}
