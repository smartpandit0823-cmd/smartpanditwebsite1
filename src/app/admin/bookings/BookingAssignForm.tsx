"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, UserCheck, RefreshCw, Check, ArrowRight, IndianRupee } from "lucide-react";
import { generateWhatsAppLink, bookingWhatsAppMessage, paymentToPanditWhatsAppMessage } from "@/lib/whatsapp";

const STATUS_FLOW = [
  { key: "requested", label: "Requested", emoji: "📥", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  { key: "confirmed", label: "Confirmed", emoji: "✅", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { key: "assigned", label: "Assigned", emoji: "👨‍🦳", color: "bg-indigo-100 text-indigo-800 border-indigo-300" },
  { key: "inprogress", label: "In Progress", emoji: "🔥", color: "bg-purple-100 text-purple-800 border-purple-300" },
  { key: "completed", label: "Completed", emoji: "🎉", color: "bg-green-100 text-green-800 border-green-300" },
  { key: "cancelled", label: "Cancelled", emoji: "❌", color: "bg-red-100 text-red-800 border-red-300" },
];

export function BookingAssignForm({
  bookingId,
  currentPandit,
  currentStatus,
  pandits,
  bookingDetails,
}: {
  bookingId: string;
  currentPandit?: string;
  currentStatus: string;
  pandits: { _id: string; name: string; phone: string }[];
  bookingDetails: {
    userName: string;
    userPhone: string;
    pujaName: string;
    packageName: string;
    date: string;
    time: string;
    address: string;
    amount: number;
    paymentType?: string;
    amountPaid?: number;
    addressMapUrl?: string;
    panditPayoutStatus?: "pending" | "paid";
    panditPayoutAmount?: number;
  };
}) {
  const router = useRouter();
  const [panditId, setPanditId] = useState(currentPandit || "");
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [payoutAmount, setPayoutAmount] = useState("");

  async function handleAssign() {
    if (!panditId) return;
    setLoading(true);
    setSuccess("");
    const res = await fetch(`/api/admin/bookings/${bookingId}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ panditId }),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess("Pandit assigned! ✅");
      router.refresh();
    }
  }

  async function handleStatusChange() {
    setLoading(true);
    setSuccess("");
    const res = await fetch(`/api/admin/bookings/${bookingId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, note }),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess(`Status updated to ${status}! ✅`);
      router.refresh();
    }
  }

  async function handlePayout() {
    if (!payoutAmount || isNaN(Number(payoutAmount))) return;
    setLoading(true);
    setSuccess("");
    const res = await fetch(`/api/admin/bookings/${bookingId}/payout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payoutAmount: Number(payoutAmount) }),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess("Pandit paid successfully! ✅");

      // WhatsApp notification loop here if needed
      const p = pandits.find((x) => x._id === panditId);
      if (p) {
        const link = generateWhatsAppLink(
          p.phone,
          paymentToPanditWhatsAppMessage(p.name, Number(payoutAmount), bookingDetails.pujaName)
        );
        window.open(link, "_blank");
      }
      router.refresh();
    }
  }

  function handleWhatsApp() {
    const p = pandits.find((x) => x._id === panditId);
    if (!p) return;
    const link = generateWhatsAppLink(
      p.phone,
      bookingWhatsAppMessage({
        panditName: p.name,
        userName: bookingDetails.userName,
        userPhone: bookingDetails.userPhone,
        pujaName: bookingDetails.pujaName,
        packageName: bookingDetails.packageName,
        date: bookingDetails.date,
        time: bookingDetails.time,
        address: bookingDetails.address,
        amount: bookingDetails.amount,
        paymentType: bookingDetails.paymentType,
        amountPaid: bookingDetails.amountPaid,
        addressMapUrl: bookingDetails.addressMapUrl,
      })
    );
    window.open(link, "_blank");
  }

  const currentStepIndex = STATUS_FLOW.findIndex((s) => s.key === currentStatus);

  return (
    <div className="space-y-4 sticky top-6">

      {/* ── Status Timeline ── */}
      <div className="rounded-2xl border border-gold-200 bg-white p-5">
        <h3 className="text-sm font-bold text-warm-900 mb-4">📊 Status Flow</h3>
        <div className="space-y-2">
          {STATUS_FLOW.filter((s) => s.key !== "cancelled").map((s, i) => {
            const isCurrent = s.key === currentStatus;
            const isDone = i < currentStepIndex;
            const isCancelled = currentStatus === "cancelled";
            return (
              <div key={s.key} className="flex items-center gap-3">
                <div className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-all ${isCancelled ? "border-gray-200 bg-gray-50 text-gray-400" :
                  isDone ? "border-green-400 bg-green-100 text-green-700" :
                    isCurrent ? "border-saffron-400 bg-saffron-100 text-saffron-700 ring-2 ring-saffron-200" :
                      "border-warm-200 bg-warm-50 text-warm-300"
                  }`}>
                  {isDone ? <Check size={14} /> : s.emoji}
                </div>
                <span className={`text-sm font-medium ${isCurrent ? "text-saffron-700 font-bold" : isDone ? "text-green-700" : "text-warm-400"}`}>
                  {s.label}
                </span>
                {isCurrent && <span className="rounded-full bg-saffron-500 px-2 py-0.5 text-[10px] font-bold text-white">Current</span>}
              </div>
            );
          })}
          {currentStatus === "cancelled" && (
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-red-400 bg-red-100 text-sm font-bold text-red-700 ring-2 ring-red-200">
                ❌
              </div>
              <span className="text-sm font-bold text-red-700">Cancelled</span>
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">Current</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Assign Pandit ── */}
      <div className="rounded-2xl border border-gold-200 bg-white p-5 space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-bold text-warm-900">
          <UserCheck size={16} className="text-saffron-500" />
          Assign Pandit
        </h3>
        <Select value={panditId} onValueChange={setPanditId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select pandit..." />
          </SelectTrigger>
          <SelectContent>
            {pandits.map((p) => (
              <SelectItem key={p._id} value={p._id}>
                {p.name} ({p.phone})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button onClick={handleAssign} disabled={loading || !panditId} className="flex-1" size="sm">
            <UserCheck size={14} className="mr-1" />
            Assign
          </Button>
          {panditId && (
            <Button
              variant="outline"
              size="sm"
              className="bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border-[#25D366]/50"
              onClick={handleWhatsApp}
            >
              <MessageCircle size={14} className="mr-1" />
              WhatsApp
            </Button>
          )}
        </div>
      </div>

      {/* ── Pandit Payout ── */}
      {panditId && (
        <div className="rounded-2xl border border-gold-200 bg-white p-5 space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-bold text-warm-900">
            <IndianRupee size={16} className="text-green-600" />
            Pandit Payment
          </h3>

          {bookingDetails.panditPayoutStatus === "paid" ? (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-center">
              <p className="text-sm font-bold text-green-700">✅ Paid ₹{bookingDetails.panditPayoutAmount}</p>
              <p className="text-[11px] text-green-600 mt-1">Amount safely sent to pandit.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[11px] text-gray-500 leading-tight">
                For Full Payments, mark how much you are paying to the pandit. Keep your platform fee.
              </p>
              <div className="flex items-end gap-2">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">Payout Amount (₹)</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 500"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handlePayout}
                  disabled={loading || !payoutAmount || isNaN(Number(payoutAmount))}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Mark Paid
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Update Status ── */}
      <div className="rounded-2xl border border-gold-200 bg-white p-5 space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-bold text-warm-900">
          <RefreshCw size={16} className="text-saffron-500" />
          Update Status
        </h3>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FLOW.map((s) => (
              <SelectItem key={s.key} value={s.key}>
                {s.emoji} {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button variant="outline" onClick={handleStatusChange} disabled={loading} className="w-full" size="sm">
          <ArrowRight size={14} className="mr-1" />
          Update Status
        </Button>
      </div>

      {/* Success Toast */}
      {success && (
        <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-medium text-green-700 animate-in fade-in">
          {success}
        </div>
      )}
    </div>
  );
}
