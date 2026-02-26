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

  const filter: Record<string, unknown> = {};
  if (params.status && params.status !== "all") filter.status = params.status;
  if (params.q) {
    filter.$or = [
      { "shippingAddress.name": { $regex: params.q, $options: "i" } },
      { "shippingAddress.phone": { $regex: params.q, $options: "i" } },
    ];
  }

  const [data, total] = await Promise.all([
    Order.find(filter)
      .populate("userId", "phone name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  const serialized = JSON.parse(JSON.stringify(data));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-warm-900">Orders</h1>
        <p className="mt-1 text-gray-600">Store orders — track, update status, add tracking</p>
      </div>
      <OrdersTable data={serialized} total={total} page={page} />
    </div>
  );
}
