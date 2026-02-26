import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Booking from "@/models/Booking";
import Pandit from "@/models/Pandit";
import { BookingsTableV2 } from "./BookingsTable";
import Link from "next/link";
import { cn } from "@/lib/utils/index";

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; paymentStatus?: string; q?: string; tab?: string }>;
}) {
  await auth();
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const tab = params.tab || "valid"; // 'valid' or 'failed'
  const limit = 20;
  await connectDB();

  const filter: Record<string, unknown> = {};

  if (tab === "valid") {
    filter.amountPaid = { $gt: 0 };
  } else if (tab === "failed") {
    // Show either 0 amount paid OR explictly failed status
    filter.$or = [{ amountPaid: 0 }, { paymentStatus: "failed" }];
  }

  if (params.status && params.status !== "all") filter.status = params.status;
  if (params.paymentStatus && params.paymentStatus !== "all" && tab !== "failed") filter.paymentStatus = params.paymentStatus;
  if (params.q) {
    // Search requires user population, so we do a basic approach
    filter.$and = filter.$or ? [{ $or: filter.$or }, {
      $or: [
        { address: { $regex: params.q, $options: "i" } },
        { package: { $regex: params.q, $options: "i" } },
      ]
    }] : undefined;

    if (!filter.$and) {
      filter.$or = [
        { address: { $regex: params.q, $options: "i" } },
        { package: { $regex: params.q, $options: "i" } },
      ];
    }
  }

  const [data, total, pandits] = await Promise.all([
    Booking.find(filter)
      .populate("pujaId", "name slug")
      .populate("userId", "phone name")
      .populate("assignedPanditId", "name phone")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Booking.countDocuments(filter),
    Pandit.find({ status: "active" }).select("name phone").lean(),
  ]);

  const serializedData = JSON.parse(JSON.stringify(data));
  const serializedPandits = JSON.parse(JSON.stringify(pandits));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-warm-900">Bookings</h1>
        <p className="mt-1 text-gray-600">
          Puja bookings — WhatsApp assign pandit, update status
        </p>
      </div>

      <div className="flex items-center gap-4 border-b border-warm-200">
        <Link
          href="/admin/bookings?tab=valid"
          className={cn(
            "pb-3 text-sm font-semibold transition-colors border-b-2",
            tab === "valid" ? "border-saffron-600 text-saffron-700" : "border-transparent text-gray-500 hover:text-warm-900"
          )}
        >
          ✅ Legitimate Bookings (Paid)
        </Link>
        <Link
          href="/admin/bookings?tab=failed"
          className={cn(
            "pb-3 text-sm font-semibold transition-colors border-b-2",
            tab === "failed" ? "border-red-500 text-red-700" : "border-transparent text-gray-500 hover:text-warm-900"
          )}
        >
          ❌ Failed / Try Bookings
        </Link>
      </div>

      <BookingsTableV2
        data={serializedData}
        total={total}
        page={page}
        pandits={serializedPandits}
      />
    </div>
  );
}
