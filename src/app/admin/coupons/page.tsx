import { Metadata } from "next";
import { Plus, Search, Tag, Users, CalendarDays, ExternalLink, Ticket, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import connectDB from "@/lib/db/mongodb";
import Coupon from "@/models/Coupon";

export const metadata: Metadata = {
  title: "Coupon Management - Admin | SmartPandit",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CouponsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/admin/login");

  await connectDB();

  // Auto-expire
  await Coupon.updateMany(
    { expiresAt: { $lt: new Date() }, status: "active", autoExpire: true },
    { status: "expired" }
  );

  const params = await searchParams;
  const query: any = {};
  if (params.q) query.code = { $regex: params.q, $options: "i" };

  const rawCoupons = await Coupon.find(query).sort({ createdAt: -1 });
  const coupons = JSON.parse(JSON.stringify(rawCoupons));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Ticket className="text-purple-600" /> Coupon Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage discounts, offers, and marketing rules</p>
        </div>
        <Link href="/admin/coupons/new">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2 h-10 w-full sm:w-auto">
            <Plus size={16} /> Create New Coupon
          </Button>
        </Link>
      </div>

      {/* Suggested Strategy Cards (as requested) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Festival Offers", desc: "Auto apply mode", tag: "Festival", color: "text-amber-600", bg: "bg-amber-50" },
          { label: "₹100 Off Minimal", desc: "For carts > ₹999", tag: "Clearance", color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "10% Welcome", desc: "Max ₹500 cap", tag: "Influencer", color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "First Order", desc: "First time users", tag: "Referral", color: "text-pink-600", bg: "bg-pink-50" },
        ].map((c, i) => (
          <div key={i} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className={`p-2 w-fit rounded-lg ${c.bg} mb-3`}>
              <Tag size={16} className={c.color} />
            </div>
            <p className="text-sm font-bold text-gray-900">{c.label}</p>
            <p className="text-xs text-gray-500">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <form className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input name="q" placeholder="Search coupon code..." defaultValue={params.q} className="pl-10 bg-gray-50 border-gray-200 focus:bg-white" />
        </form>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <Button variant="outline" size="sm" className="shrink-0 bg-white shadow-sm border-gray-200">Active</Button>
          <Button variant="outline" size="sm" className="shrink-0 bg-white shadow-sm border-gray-200">Expired</Button>
          <Button variant="outline" size="sm" className="shrink-0 bg-white shadow-sm border-gray-200">Auto Apply</Button>
        </div>
      </div>

      {/* Coupon List Table */}
      <Card className="rounded-xl overflow-hidden border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-xs font-semibold uppercase text-gray-900 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Coupon Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4 whitespace-nowrap">Usage Limit</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((coupon: any) => (
                <tr key={coupon._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 uppercase tracking-wide">{coupon.code}</span>
                      <span className="text-[11px] text-gray-500 line-clamp-1">{coupon.name}</span>
                      {coupon.autoApply && (
                        <span className="mt-1 w-max text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">AUTO APPLY</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">
                      {coupon.type === "percentage" ? `${coupon.discountValue}% OFF` : coupon.type === "flat" ? `₹${coupon.discountValue} FLAT` : "FREE SHIPPING"}
                    </div>
                    {coupon.minOrderAmount > 0 && <div className="text-[11px] text-gray-500">Min Cart: ₹{coupon.minOrderAmount}</div>}
                    {coupon.maxDiscountAmount > 0 && <div className="text-[11px] text-gray-500">Max Cap: ₹{coupon.maxDiscountAmount}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 w-32">
                      <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
                        <span>{coupon.usageCount} Used</span>
                        <span>{coupon.usageLimit > 0 ? coupon.usageLimit : "∞"}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all"
                          style={{ width: `${Math.min((coupon.usageCount / (coupon.usageLimit || 1)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`px-2.5 py-1 inline-flex text-[10px] leading-5 font-bold rounded-full uppercase ${coupon.status === "active" ? "bg-emerald-100 text-emerald-800" :
                        coupon.status === "expired" ? "bg-red-100 text-red-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                        {coupon.status}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium whitespace-nowrap">
                        <CalendarDays size={10} /> Exp: {new Date(coupon.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/coupons/new?edit=${coupon._id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <Edit size={16} />
                        </Button>
                      </Link>
                      <form action={async () => {
                        "use server";
                        const { deleteCoupon } = await import("@/actions/coupon.actions");
                        await deleteCoupon(coupon._id);
                      }}>
                        <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 size={16} />
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                        <Ticket className="text-gray-400" />
                      </div>
                      <p className="font-semibold text-gray-900 mb-1">No coupons found</p>
                      <p className="text-xs text-gray-500">Create your first discount code to boost sales.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
