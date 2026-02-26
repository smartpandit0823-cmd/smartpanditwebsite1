import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Booking from "@/models/Booking";
import Pandit from "@/models/Pandit";
import { notFound } from "next/navigation";
import { BookingAssignForm } from "../BookingAssignForm";

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    requested: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    assigned: "bg-indigo-100 text-indigo-800 border-indigo-200",
    inprogress: "bg-purple-100 text-purple-800 border-purple-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    payment_pending: "bg-orange-100 text-orange-800 border-orange-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${colors[status] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function PaymentBadge({ type, amountPaid, totalAmount }: { type: string; amountPaid: number; totalAmount: number }) {
  if (type === "advance") {
    return (
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-orange-100 border border-orange-200 px-3 py-1 text-xs font-bold text-orange-700 uppercase">Advance</span>
        <span className="text-xs text-warm-500">₹{amountPaid.toLocaleString("en-IN")} / ₹{totalAmount.toLocaleString("en-IN")}</span>
      </div>
    );
  }
  return (
    <span className="rounded-full bg-green-100 border border-green-200 px-3 py-1 text-xs font-bold text-green-700 uppercase">Full Paid ✅</span>
  );
}

function InfoRow({ label, value, highlight, mono }: { label: string; value: string | number | React.ReactNode; highlight?: boolean; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-warm-100 last:border-b-0">
      <span className="text-sm text-warm-500 shrink-0">{label}</span>
      <span className={`text-sm text-right ${highlight ? "font-bold text-saffron-700" : "font-medium text-warm-900"} ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}

function generateGoogleMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await auth();
  const { id } = await params;
  await connectDB();

  const bookingDoc = await Booking.findById(id)
    .populate("pujaId", "name slug packages")
    .populate("userId", "phone name email city")
    .populate("assignedPanditId", "name phone city")
    .lean();

  if (!bookingDoc) notFound();

  const booking = JSON.parse(JSON.stringify(bookingDoc));

  const panditsDoc = await Pandit.find({ status: "active", verificationStatus: "verified" })
    .select("name phone city")
    .lean();

  const pandits = JSON.parse(JSON.stringify(panditsDoc));

  const totalAmount = booking.amount || 0;
  const amountPaid = booking.amountPaid ?? totalAmount;
  const remaining = totalAmount - amountPaid;
  const paymentType = booking.paymentType || "full";
  const addressMapUrl = booking.address ? generateGoogleMapsUrl(booking.address) : "";

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-warm-900">
              {booking.bookingId || `#${id.slice(-8)}`}
            </h1>
            <StatusBadge status={booking.status} />
          </div>
          <p className="mt-1 text-sm text-warm-500">{booking.pujaId?.name} • Created {new Date(booking.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── LEFT: Booking Info (2 cols on lg) ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Booking Details Card */}
          <div className="rounded-2xl border border-gold-200 bg-white overflow-hidden">
            <div className="bg-gradient-to-r from-saffron-50 to-gold-50 px-5 py-3 border-b border-gold-200">
              <h2 className="text-sm font-bold text-warm-900">📋 Booking Details</h2>
            </div>
            <div className="px-5 py-2">
              <InfoRow label="Booking ID" value={booking.bookingId || "—"} highlight mono />
              <InfoRow label="Puja" value={booking.pujaId?.name || "—"} />
              <InfoRow label="Package" value={<span className="capitalize">{booking.package || "—"}</span>} />
              <InfoRow label="Date" value={new Date(booking.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" })} />
              <InfoRow label="Time" value={booking.time || "—"} />
              <InfoRow label="Status" value={<StatusBadge status={booking.status} />} />
              {booking.notes && <InfoRow label="Notes" value={booking.notes} />}
            </div>
          </div>

          {/* Payment Card */}
          <div className="rounded-2xl border border-gold-200 bg-white overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-5 py-3 border-b border-green-200">
              <h2 className="text-sm font-bold text-warm-900">💳 Payment Details</h2>
            </div>
            <div className="px-5 py-2">
              <InfoRow label="Total Amount" value={`₹${totalAmount.toLocaleString("en-IN")}`} highlight />
              <InfoRow label="Payment Type" value={<PaymentBadge type={paymentType} amountPaid={amountPaid} totalAmount={totalAmount} />} />
              <InfoRow label="Amount Paid" value={<span className="text-green-700 font-bold">₹{amountPaid.toLocaleString("en-IN")}</span>} />
              {remaining > 0 && (
                <InfoRow label="Remaining" value={<span className="text-orange-600 font-bold">₹{remaining.toLocaleString("en-IN")}</span>} />
              )}
              <InfoRow label="Payment Status" value={
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold uppercase ${booking.paymentStatus === "paid" ? "bg-green-100 text-green-700" :
                  booking.paymentStatus === "partial" ? "bg-orange-100 text-orange-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                  {booking.paymentStatus || "pending"}
                </span>
              } />
            </div>

            {/* Revenue Breakdown (Admin Only) */}
            {paymentType === "advance" && (
              <div className="mx-5 mb-4 rounded-xl bg-amber-50 border border-amber-200 p-3">
                <p className="text-xs font-bold text-amber-800 mb-1">⚠️ Admin Note — Advance Payment</p>
                <p className="text-xs text-amber-700">
                  Customer ne ₹{amountPaid.toLocaleString("en-IN")} advance pay kiya hai.
                  Remaining ₹{remaining.toLocaleString("en-IN")} pandit collect karega puja ke time.
                  Pandit ko advance amount nahi bataya jayega.
                </p>
              </div>
            )}
          </div>

          {/* Customer Card */}
          <div className="rounded-2xl border border-gold-200 bg-white overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-3 border-b border-blue-200">
              <h2 className="text-sm font-bold text-warm-900">👤 Customer Details</h2>
            </div>
            <div className="px-5 py-2">
              <InfoRow label="Name" value={booking.userId?.name || "—"} />
              <InfoRow label="Phone" value={
                <a href={`tel:${booking.userId?.phone}`} className="text-saffron-600 hover:underline font-medium">
                  {booking.userId?.phone || "—"}
                </a>
              } />
              {booking.userId?.email && <InfoRow label="Email" value={booking.userId.email} />}
              {booking.userId?.city && <InfoRow label="City" value={booking.userId.city} />}
            </div>
          </div>

          {/* Address Card with Google Maps */}
          <div className="rounded-2xl border border-gold-200 bg-white overflow-hidden">
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-5 py-3 border-b border-teal-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-warm-900">📍 Puja Address</h2>
              {addressMapUrl && (
                <a
                  href={addressMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition"
                >
                  🗺️ Open in Google Maps
                </a>
              )}
            </div>
            <div className="px-5 py-4">
              <p className="text-sm text-warm-700 leading-relaxed">{booking.address || "No address provided"}</p>
              {addressMapUrl && (
                <a href={addressMapUrl} target="_blank" rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium">
                  📍 Get Directions →
                </a>
              )}
            </div>
          </div>

          {/* Pandit Card */}
          {booking.assignedPanditId && (
            <div className="rounded-2xl border border-gold-200 bg-white overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-5 py-3 border-b border-purple-200">
                <h2 className="text-sm font-bold text-warm-900">👨‍🦳 Assigned Pandit</h2>
              </div>
              <div className="px-5 py-2">
                <InfoRow label="Name" value={booking.assignedPanditId.name} />
                <InfoRow label="Phone" value={
                  <a href={`tel:${booking.assignedPanditId.phone}`} className="text-saffron-600 hover:underline font-medium">
                    {booking.assignedPanditId.phone}
                  </a>
                } />
                {booking.assignedPanditId.city && <InfoRow label="City" value={booking.assignedPanditId.city} />}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Admin Actions ── */}
        <div className="lg:col-span-1">
          <BookingAssignForm
            bookingId={id}
            currentPandit={booking.assignedPanditId?._id}
            currentStatus={booking.status}
            pandits={pandits}
            bookingDetails={{
              userName: booking.userId?.name || "Customer",
              userPhone: booking.userId?.phone || "",
              pujaName: booking.pujaId?.name || "Puja",
              packageName: booking.package || "",
              date: new Date(booking.date).toLocaleDateString("en-IN"),
              time: booking.time || "",
              address: booking.address || "",
              amount: totalAmount,
              paymentType,
              amountPaid,
              addressMapUrl,
              panditPayoutStatus: booking.panditPayoutStatus || "pending",
              panditPayoutAmount: booking.panditPayoutAmount || 0,
            }}
          />
        </div>
      </div>
    </div>
  );
}
