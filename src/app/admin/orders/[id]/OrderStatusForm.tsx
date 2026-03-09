"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle2, Truck, Package, CreditCard, XCircle, Clock, Tag, FileText, MapPin, CalendarClock, Ban } from "lucide-react";

const ORDER_STATUSES = [
    { value: "created", label: "Created", icon: Clock, color: "text-gray-500" },
    { value: "paid", label: "Paid", icon: CreditCard, color: "text-emerald-600" },
    { value: "processing", label: "Processing", icon: Package, color: "text-amber-600" },
    { value: "shipped", label: "Shipped", icon: Truck, color: "text-blue-600" },
    { value: "delivered", label: "Delivered", icon: CheckCircle2, color: "text-emerald-600" },
    { value: "cancelled", label: "Cancelled", icon: XCircle, color: "text-red-600" },
];

export function OrderStatusForm({
    orderId,
    currentStatus,
    waybill,
}: {
    orderId: string;
    currentStatus: string;
    waybill?: string;
}) {
    const router = useRouter();
    const [status, setStatus] = useState(currentStatus);
    const [trackingId, setTrackingId] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Delhivery integration states
    const [shipping, setShipping] = useState(false);
    const [shipResult, setShipResult] = useState<{ success: boolean; message?: string; waybill?: string; error?: string } | null>(null);
    const [tracking, setTracking] = useState(false);
    const [trackData, setTrackData] = useState<any>(null);

    const [scheduling, setScheduling] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [actionMessage, setActionMessage] = useState<{ type: "success" | "error", message: string } | null>(null);

    async function handleUpdate() {
        setLoading(true);
        setSuccess(false);
        try {
            const res = await fetch(`/api/admin/orders/${orderId}/status`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, trackingId: trackingId || undefined }),
            });
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
                router.refresh();
            }
        } catch {
            // handle silently
        } finally {
            setLoading(false);
        }
    }

    async function handleShipWithDelhivery() {
        setShipping(true);
        setShipResult(null);
        try {
            const res = await fetch("/api/admin/shipping/ship", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId }),
            });
            const data = await res.json();
            setShipResult(data);
            if (data.success) {
                setTimeout(() => router.refresh(), 1500);
            }
        } catch (error) {
            setShipResult({ success: false, error: "Network error" });
        } finally {
            setShipping(false);
        }
    }

    async function handleTrackDelhivery() {
        setTracking(true);
        try {
            const wb = waybill || shipResult?.waybill;
            if (!wb) return;
            const res = await fetch(`/api/admin/shipping/track?waybill=${wb}&orderId=${orderId}`);
            const data = await res.json();
            setTrackData(data);
            router.refresh();
        } catch {
            // silent
        } finally {
            setTracking(false);
        }
    }

    async function handleGetLabel() {
        const wb = waybill || shipResult?.waybill;
        if (!wb) return;
        window.open(`/api/admin/shipping/label?waybill=${wb}`, "_blank");
    }

    async function handleSchedulePickup() {
        if (!confirm("Schedule pickup for tomorrow?")) return;
        setScheduling(true);
        setActionMessage(null);
        try {
            // schedule for tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const pickupDate = tomorrow.toISOString().split("T")[0]; // YYYY-MM-DD

            const res = await fetch("/api/admin/shipping/pickup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pickupDate, expectedPackageCount: 1 }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setActionMessage({ type: "success", message: "Pickup scheduled for tomorrow." });
            } else {
                let errMsg = data.error || "Failed to schedule pickup.";
                if (data.details?.prepaid) {
                    errMsg = `Delhivery Error: ${data.details.prepaid}`;
                } else if (data.details) {
                    try {
                        const parsed = typeof data.details === 'string' ? JSON.parse(data.details) : data.details;
                        if (parsed.prepaid) errMsg = parsed.prepaid;
                        else if (parsed.message) errMsg = parsed.message;
                        else if (parsed.error) errMsg = parsed.error;
                    } catch { }
                }
                setActionMessage({ type: "error", message: errMsg });
            }
        } catch {
            setActionMessage({ type: "error", message: "Network error occurred." });
        } finally {
            setScheduling(false);
        }
    }

    async function handleCancelShipment() {
        if (!confirm("Are you sure you want to cancel this Delhivery shipment? This cannot be undone.")) return;
        setCancelling(true);
        setActionMessage(null);
        try {
            const wb = waybill || shipResult?.waybill;
            if (!wb) return;

            const res = await fetch("/api/admin/shipping/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, waybill: wb }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setActionMessage({ type: "success", message: "Shipment cancelled successfully." });
                setTimeout(() => router.refresh(), 1500);
            } else {
                setActionMessage({ type: "error", message: data.error || "Failed to cancel shipment." });
            }
        } catch {
            setActionMessage({ type: "error", message: "Network error occurred." });
        } finally {
            setCancelling(false);
        }
    }

    const hasWaybill = waybill || shipResult?.waybill;

    return (
        <div className="space-y-6">
            {/* Manual Status Update */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-5">Update Order Status</h2>
                <div className="flex flex-wrap items-end gap-4">
                    <div className="space-y-2 min-w-[200px]">
                        <Label className="text-sm font-medium text-gray-700">Order Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-[200px] h-10 rounded-xl border-gray-200">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                {ORDER_STATUSES.map((s) => {
                                    const Icon = s.icon;
                                    return (
                                        <SelectItem key={s.value} value={s.value}>
                                            <span className="flex items-center gap-2">
                                                <Icon className={`h-3.5 w-3.5 ${s.color}`} />
                                                {s.label}
                                            </span>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2 min-w-[220px]">
                        <Label className="text-sm font-medium text-gray-700">Tracking ID</Label>
                        <Input
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value)}
                            placeholder="e.g. SR12345678"
                            className="h-10 rounded-xl border-gray-200 focus:border-saffron-300"
                        />
                    </div>
                    <Button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="h-10 rounded-xl bg-gray-900 hover:bg-gray-800 px-6"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Updating...
                            </span>
                        ) : (
                            "Update Order"
                        )}
                    </Button>
                    {success && (
                        <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 animate-scale-in">
                            <CheckCircle2 className="h-4 w-4" />
                            Updated!
                        </span>
                    )}
                </div>
            </div>

            {/* ── Delhivery Shipping Panel ── */}
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <h2 className="text-base font-semibold text-gray-900">Delhivery Shipping</h2>
                    {hasWaybill && (
                        <span className="ml-auto inline-flex items-center gap-1 text-xs font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                            <Tag className="h-3 w-3" />
                            AWB: {waybill || shipResult?.waybill}
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap gap-3">
                    {/* Ship Button */}
                    {!hasWaybill && (
                        <Button
                            onClick={handleShipWithDelhivery}
                            disabled={shipping || currentStatus === "cancelled"}
                            className="rounded-xl bg-blue-600 hover:bg-blue-700 px-6 h-10"
                        >
                            {shipping ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" /> Creating Shipment...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Truck className="h-4 w-4" /> Ship via Delhivery
                                </span>
                            )}
                        </Button>
                    )}

                    {/* Track Button */}
                    {hasWaybill && (
                        <>
                            <Button
                                onClick={handleTrackDelhivery}
                                disabled={tracking}
                                variant="outline"
                                className="rounded-xl border-blue-200 text-blue-700 hover:bg-blue-100 h-10"
                            >
                                {tracking ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" /> Tracking...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" /> Live Track
                                    </span>
                                )}
                            </Button>

                            <Button
                                onClick={handleGetLabel}
                                variant="outline"
                                className="rounded-xl border-blue-200 text-blue-700 hover:bg-blue-100 h-10"
                            >
                                <span className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" /> Print Label
                                </span>
                            </Button>

                            <Button
                                onClick={handleSchedulePickup}
                                disabled={scheduling}
                                variant="outline"
                                className="rounded-xl border-amber-200 text-amber-700 hover:bg-amber-100 h-10"
                            >
                                {scheduling ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" /> Scheduling...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <CalendarClock className="h-4 w-4" /> Schedule Pickup
                                    </span>
                                )}
                            </Button>

                            <Button
                                onClick={handleCancelShipment}
                                disabled={cancelling}
                                variant="outline"
                                className="rounded-xl border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800 h-10"
                            >
                                {cancelling ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" /> Cancelling...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Ban className="h-4 w-4" /> Cancel Shipment
                                    </span>
                                )}
                            </Button>
                        </>
                    )}
                </div>

                {/* Actions Result Message */}
                {actionMessage && (
                    <div className={`mt-4 p-3 rounded-xl border text-sm flex items-center gap-2 ${actionMessage.type === "success"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-red-50 border-red-200 text-red-700"
                        }`}>
                        {actionMessage.type === "success" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                        {actionMessage.message}
                    </div>
                )}

                {/* Ship Result */}
                {shipResult && (
                    <div className={`mt-4 p-3 rounded-xl border text-sm ${shipResult.success
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-red-50 border-red-200 text-red-700"
                        }`}>
                        {shipResult.success
                            ? `✅ Shipment created! AWB: ${shipResult.waybill}`
                            : `❌ Error: ${shipResult.error}`}
                    </div>
                )}

                {/* Tracking Data */}
                {trackData && (
                    <div className={`mt-4 p-4 rounded-xl bg-white border ${trackData.success ? "border-blue-200" : "border-amber-200"}`}>
                        {trackData.success ? (
                            <>
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm font-bold text-gray-900">Live Status: <span className="text-blue-600">{trackData.currentStatus}</span></p>
                                    {trackData.estimatedDelivery && (
                                        <p className="text-xs text-gray-500">EDD: {trackData.estimatedDelivery}</p>
                                    )}
                                </div>
                                {trackData.origin && (
                                    <p className="text-xs text-gray-500 mb-3">
                                        📍 {trackData.origin || "..."} ➔ {trackData.destination || "..."}
                                    </p>
                                )}
                                {trackData.scans && trackData.scans.length > 0 ? (
                                    <div className="space-y-0 relative mt-4">
                                        {trackData.scans.map((scan: any, idx: number) => {
                                            const isFirst = idx === 0;
                                            const isLast = idx === trackData.scans.length - 1;
                                            return (
                                                <div key={idx} className="flex gap-3 relative pb-4">
                                                    {/* Line */}
                                                    {!isLast && (
                                                        <div className="absolute left-[7px] top-[20px] w-[2px] h-[calc(100%)] bg-blue-100" />
                                                    )}
                                                    {/* Dot */}
                                                    <div className={`relative z-10 mt-1 w-4 h-4 shrink-0 rounded-full border-2 ${isFirst ? "bg-blue-500 border-blue-500" : "bg-white border-blue-200"}`} />
                                                    {/* Content */}
                                                    <div className={`flex-1 ${isLast ? "pb-0" : ""}`}>
                                                        <span className="text-[10px] text-[#888888] font-medium block mb-0.5">
                                                            {scan.date ? new Date(scan.date).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }) : ""}
                                                        </span>
                                                        <p className={`text-xs font-bold ${isFirst ? "text-blue-700" : "text-[#1A1A1A]"}`}>
                                                            {scan.status} {scan.location ? `at ${scan.location}` : ""}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100">
                                        ⏳ No scan updates yet. Shipment is manifested. Tracking will appear after pickup.
                                    </p>
                                )}
                            </>
                        ) : (
                            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100">
                                ⚠️ {trackData.currentStatus || "Tracking data not available yet"}. Check back after the shipment is picked up.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
