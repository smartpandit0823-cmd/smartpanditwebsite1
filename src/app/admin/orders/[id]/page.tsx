import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Order from "@/models/Order";
import { notFound } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils/index";
import { OrderStatusForm } from "./OrderStatusForm";
import { StatusBadge } from "@/components/admin/AdminTable";
import Link from "next/link";
import { trackShipment } from "@/lib/shipping/delhivery";

const STATUS_STEPS = ["created", "paid", "processing", "shipped", "delivered"];

export default async function OrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await auth();
    const { id } = await params;
    await connectDB();

    const order = await Order.findById(id)
        .select("items totalAmount shippingFee status paymentStatus shippingAddress razorpayPaymentId trackingId delhiveryWaybill delhiveryStatus createdAt updatedAt userId")
        .populate("userId", "phone name")
        .lean();
    if (!order) notFound();

    const o = JSON.parse(JSON.stringify(order));
    const currentStepIndex = STATUS_STEPS.indexOf(o.status);
    const tracking = o.delhiveryWaybill ? await trackShipment(o.delhiveryWaybill) : null;

    return (
        <div className="space-y-6 max-w-5xl animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <Link href="/admin/orders" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                            ← Back to Orders
                        </Link>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        Order #{o._id.slice(-8).toUpperCase()}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Placed on {formatDate(o.createdAt)}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <StatusBadge status={o.status} />
                    <StatusBadge status={o.paymentStatus} />
                </div>
            </div>

            {/* Status Pipeline */}
            {o.status !== "cancelled" && (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-900 mb-5">Order Progress</h2>
                    <div className="flex items-center">
                        {STATUS_STEPS.map((step, i) => {
                            const isCompleted = i <= currentStepIndex;
                            const isCurrent = i === currentStepIndex;
                            return (
                                <div key={step} className="flex items-center flex-1 last:flex-none">
                                    <div className="flex flex-col items-center">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${isCompleted
                                            ? "border-emerald-500 bg-emerald-500 text-white"
                                            : "border-gray-200 bg-white text-gray-400"
                                            } ${isCurrent ? "ring-4 ring-emerald-100" : ""}`}>
                                            {isCompleted ? (
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <span className="text-xs font-bold">{i + 1}</span>
                                            )}
                                        </div>
                                        <span className={`mt-2 text-xs font-medium capitalize ${isCompleted ? "text-emerald-600" : "text-gray-400"
                                            }`}>
                                            {step}
                                        </span>
                                    </div>
                                    {i < STATUS_STEPS.length - 1 && (
                                        <div className={`flex-1 h-0.5 mx-3 rounded-full ${i < currentStepIndex ? "bg-emerald-500" : "bg-gray-200"
                                            }`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {o.status === "cancelled" && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
                            <span className="text-red-600 text-lg">✕</span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-red-800">Order Cancelled</p>
                            <p className="text-xs text-red-600">This order has been cancelled</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Info Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Order Info */}
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">Order Information</h2>
                    <div className="space-y-3">
                        {[
                            { label: "Order ID", value: o._id },
                            { label: "Subtotal", value: formatCurrency(o.totalAmount - (o.shippingFee || 0)) },
                            { label: "Shipping Fee", value: (o.shippingFee || 0) === 0 ? "FREE" : formatCurrency(o.shippingFee || 0) },
                            { label: "Total Amount", value: formatCurrency(o.totalAmount), bold: true },
                            { label: "Payment Status", value: o.paymentStatus, badge: true },
                            { label: "Order Date", value: formatDate(o.createdAt) },
                            { label: "Razorpay ID", value: o.razorpayPaymentId || "—" },
                            { label: "AWB / Waybill", value: o.delhiveryWaybill || "Not yet created" },
                            { label: "Delhivery Status", value: o.delhiveryStatus || "—" },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                <span className="text-sm text-gray-500">{item.label}</span>
                                {item.badge ? (
                                    <StatusBadge status={item.value} />
                                ) : (
                                    <span className={`text-sm ${item.bold ? "font-bold text-lg text-gray-900" : "font-medium text-gray-900"}`}>
                                        {item.value}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">Shipping Address</h2>
                    <div className="space-y-2">
                        <p className="text-base font-semibold text-gray-900">{o.shippingAddress?.name}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                            📞 {o.shippingAddress?.phone}
                        </p>
                        <div className="mt-3 p-3 rounded-xl bg-gray-50 text-sm text-gray-700">
                            <p>{o.shippingAddress?.address}</p>
                            <p className="mt-1 font-medium">
                                {o.shippingAddress?.city}, {o.shippingAddress?.state} - {o.shippingAddress?.pincode}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tracking Full Width */}
            {tracking && tracking.success && (
                <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-6 shadow-sm">
                    <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        🚚 Delhivery Tracking
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-white p-4 rounded-xl border border-blue-100">
                        <div>
                            <p className="text-xs text-gray-500">Waybill ID</p>
                            <p className="font-bold text-gray-900">{tracking.waybill}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Status</p>
                            <p className="font-bold text-blue-700">{tracking.currentStatus}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Est. Delivery</p>
                            <p className="font-bold text-gray-900">{tracking.estimatedDelivery ? new Date(tracking.estimatedDelivery).toLocaleDateString() : "Pending"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Origin ➔ Dest</p>
                            <p className="font-bold text-gray-900">{tracking.origin || "..."} ➔ {tracking.destination || "..."}</p>
                        </div>
                    </div>

                    {tracking.scans && tracking.scans.length > 0 && (
                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-blue-200 before:to-transparent">
                            {tracking.scans.map((scan, idx) => (
                                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-blue-500 text-blue-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-blue-100 bg-white shadow-sm">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="text-sm font-bold text-gray-900">{scan.status}</div>
                                            <div className="text-xs text-gray-500 whitespace-nowrap">{new Date(scan.date).toLocaleString()}</div>
                                        </div>
                                        <div className="text-xs text-gray-600">Location: {scan.location}</div>
                                        {scan.instructions && <div className="text-[10px] text-gray-400 mt-1">{scan.instructions}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Items */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="p-6 pb-3">
                    <h2 className="text-base font-semibold text-gray-900">Order Items</h2>
                </div>
                <div className="px-6 pb-6">
                    <div className="space-y-3">
                        {o.items.map((item: { name: string; quantity: number; price: number; image?: string }, i: number) => (
                            <div key={i} className="flex items-center justify-between rounded-xl border border-gray-100 p-4 hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-gray-400 text-xs">📦</span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {formatCurrency(item.price)} × {item.quantity}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Totals */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between px-6">
                    <span className="text-sm font-medium text-gray-500">Shipping Fee</span>
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(o.shippingFee || 0)}</span>
                </div>
                <div className="mt-2 pt-2 pb-6 border-t border-gray-100 flex items-center justify-between px-6">
                    <span className="text-base font-semibold text-gray-700">Order Total</span>
                    <span className="text-xl font-bold text-gray-900">{formatCurrency(o.totalAmount)}</span>
                </div>
            </div>

            {/* Update Status */}
            <OrderStatusForm orderId={o._id} currentStatus={o.status} waybill={o.delhiveryWaybill || o.trackingId || ""} />
        </div>
    );
}
