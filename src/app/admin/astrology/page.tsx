import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import AstrologyRequest from "@/models/AstrologyRequest";
import Pandit from "@/models/Pandit";
import { AstrologyTable } from "./AstrologyTable";

export default async function AstrologyPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; priority?: string; q?: string }>;
}) {
  await auth();
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 20;
  await connectDB();

  const filter: Record<string, unknown> = {};
  if (params.status && params.status !== "all") filter.status = params.status;
  if (params.priority && params.priority !== "all") filter.priority = params.priority;
  if (params.q) {
    filter.$or = [
      { name: { $regex: params.q, $options: "i" } },
      { phone: { $regex: params.q, $options: "i" } },
      { email: { $regex: params.q, $options: "i" } },
    ];
  }

  const [data, total, astrologers] = await Promise.all([
    AstrologyRequest.find(filter)
      .populate("assignedAstrologerId", "name phone")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    AstrologyRequest.countDocuments(filter),
    Pandit.find({ status: "active" }).select("name phone specializations").lean(),
  ]);

  const serializedData = JSON.parse(JSON.stringify(data));
  const serializedAstrologers = JSON.parse(JSON.stringify(astrologers));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-warm-900">Astrology Requests</h1>
        <p className="mt-1 text-gray-600">
          Manage consultations — WhatsApp assign, schedule calls, track sessions
        </p>
      </div>
      <AstrologyTable
        data={serializedData}
        total={total}
        page={page}
        astrologers={serializedAstrologers}
      />
    </div>
  );
}
