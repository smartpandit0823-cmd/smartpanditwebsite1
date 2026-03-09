import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
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

  const data = customers.map((c: any) => ({
    _id: c._id.toString(),
    name: c.name || "Unknown",
    email: c.email || "",
    phone: c.phone || "",
    status: c.status || "active",
    totalOrders: c.totalOrders || 0,
    totalSpent: c.totalSpent || 0,
    loyaltyPoints: 0,
    source: c.authProvider || "website",
    createdAt: c.createdAt.toISOString(),
    lastOrderAt: null,
    city: c.city || "",
  }));

  return <CustomersClient customers={data} total={total} />;
}
