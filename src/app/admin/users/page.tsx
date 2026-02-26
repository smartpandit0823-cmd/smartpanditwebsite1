import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import { UsersTable } from "./UsersTable";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  await auth();
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 20;
  await connectDB();

  const filter: Record<string, unknown> = {};
  if (params.q) {
    filter.$or = [
      { name: { $regex: params.q, $options: "i" } },
      { phone: { $regex: params.q, $options: "i" } },
      { email: { $regex: params.q, $options: "i" } },
    ];
  }

  const [data, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  const serialized = JSON.parse(JSON.stringify(data));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-warm-900">Users</h1>
        <p className="mt-1 text-gray-600">All registered website & app users</p>
      </div>
      <UsersTable data={serialized} total={total} page={page} />
    </div>
  );
}
