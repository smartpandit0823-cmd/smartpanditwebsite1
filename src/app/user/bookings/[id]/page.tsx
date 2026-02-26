import { Suspense } from "react";
import connectDB from "@/lib/db/mongodb";
import Booking from "@/models/Booking";
import { notFound, redirect } from "next/navigation";
import { getUserFromCookie } from "@/lib/jwt/user-session";
import Link from "next/link";
import { ArrowLeft, Clock, CalendarIcon, MapPin, IndianRupee, FileText, CheckCircle2, User as UserIcon, MessageCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils/index";

export const dynamic = "force-dynamic";

export default async function UserBookingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getUserFromCookie();
    if (!session?.userId) redirect("/user/login");

    const { id } = await params;
    await connectDB();

    const bookingDoc = await Booking.findOne({ _id: id, userId: session.userId })
        .populate("pujaId", "name image description templeName templeLocation pujaType")
        .populate("assignedPanditId", "name phone photo city experience")
        .lean();

    if (!bookingDoc) notFound();
    const booking = JSON.parse(JSON.stringify(bookingDoc));

    const totalAmount = booking.amount || 0;
    const amountPaid = booking.amountPaid || 0;
    const remaining = totalAmount - amountPaid;

    const STATUS_MAP: Record<string, { label: string; color: string; desc: string }> = {
        requested: { label: "Requested", color: "bg-yellow-100 text-yellow-800", desc: "Awaiting confirmation" },
        paid: { label: "Payment Received", color: "bg-green-100 text-green-800", desc: "Payment successful" },
        assigned: { label: "Pandit Assigned", color: "bg-indigo-100 text-indigo-800", desc: "A pandit has been assigned to your booking." },
        inprogress: { label: "In Progress", color: "bg-blue-100 text-blue-800", desc: "Puja is currently happening." },
        completed: { label: "Completed", color: "bg-green-100 text-green-800", desc: "Puja successfully completed." },
        cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", desc: "Booking was cancelled." },
    };

    const statusObj = STATUS_MAP[booking.status] || { label: booking.status, color: "bg-gray-100 text-gray-800", desc: "Standard status" };
    const dateStr = new Date(booking.date).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    const isTemple = booking.pujaId?.pujaType === 'temple' || booking.pujaId?.templeName;
    const finalLocation = isTemple
        ? `${booking.pujaId?.templeName || 'Temple Pooja'}, ${booking.pujaId?.templeLocation || 'Ujjain'}`
        : booking.address;

    return (
        <div className="max-w-3xl mx-auto pb-12">
            <div className="mb-6">
                <Link href="/user/bookings" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-warm-900 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Bookings
                </Link>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-warm-100 space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:justify-between items-start gap-4 pb-6 border-b border-warm-100">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${statusObj.color}`}>
                                {statusObj.label}
                            </span>
                            <span className="text-sm font-medium text-gray-400">ID: {booking.bookingId}</span>
                        </div>
                        <h1 className="font-heading text-2xl md:text-3xl font-bold text-warm-900">
                            {booking.pujaId?.name || "Puja Booking"}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">{statusObj.desc}</p>
                    </div>
                </div>

                {/* Main Details Grid */}
                <div className="grid md:grid-cols-2 gap-8">

                    {/* Schedule & Location */}
                    <div className="space-y-6">
                        <h3 className="font-bold text-lg text-warm-900 flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-saffron-500" />
                            Schedule & Location
                        </h3>
                        <div className="space-y-4">
                            <div className="flex gap-4 items-start">
                                <div className="bg-orange-50 p-2 rounded-lg text-orange-600 shrink-0"><CalendarIcon className="w-4 h-4" /></div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Date</p>
                                    <p className="text-sm font-medium text-warm-900">{dateStr}</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="bg-amber-50 p-2 rounded-lg text-amber-600 shrink-0"><Clock className="w-4 h-4" /></div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Time</p>
                                    <p className="text-sm font-medium text-warm-900">{booking.time || "To be confirmed"}</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="bg-green-50 p-2 rounded-lg text-green-600 shrink-0"><MapPin className="w-4 h-4" /></div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Location</p>
                                    <p className="text-sm font-medium text-warm-900 leading-snug">{finalLocation}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-warm-50 rounded-2xl p-6 border border-warm-100 flex flex-col justify-center">
                        <h3 className="font-bold text-lg text-warm-900 flex items-center gap-2 mb-4">
                            <IndianRupee className="w-5 h-5 text-saffron-500" />
                            Payment Details
                        </h3>
                        <div className="space-y-3 relative">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Total Booking Amount</span>
                                <span className="font-bold text-warm-900">{formatCurrency(totalAmount)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Amount Paid</span>
                                <span className="font-bold text-green-600">{formatCurrency(amountPaid)}</span>
                            </div>
                            <hr className="border-warm-200 border-dashed" />
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-warm-900">Remaining Balance</span>
                                <span className="font-bold text-lg text-orange-600">{formatCurrency(remaining)}</span>
                            </div>

                            {remaining > 0 && booking.paymentType === "advance" && (
                                <div className="mt-4 bg-orange-100 p-3 rounded-xl border border-orange-200 flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                                    <p className="text-[11px] text-orange-800 leading-tight font-medium">
                                        Please pay the remaining {formatCurrency(remaining)} to the Pandit directly after the Puja is completed.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Assigned Pandit Section */}
                {booking.assignedPanditId && (
                    <div className="pt-6 border-t border-warm-100">
                        <h3 className="font-bold text-lg text-warm-900 flex items-center gap-2 mb-4">
                            <UserIcon className="w-5 h-5 text-saffron-500" />
                            Your Assigned Pandit
                        </h3>
                        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between bg-white rounded-2xl border border-saffron-100 p-5 gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-saffron-100 flex items-center justify-center text-2xl shrink-0 overflow-hidden border-2 border-white shadow-md">
                                    {booking.assignedPanditId?.photo ? (
                                        <img src={booking.assignedPanditId.photo} alt="Pandit" className="w-full h-full object-cover" />
                                    ) : "👨‍🦳"}
                                </div>
                                <div className="text-center sm:text-left">
                                    <h4 className="font-bold text-lg text-warm-900">{booking.assignedPanditId.name}</h4>
                                    <p className="text-sm flex items-center gap-1 mt-0.5 justify-center sm:justify-start">
                                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
                                        <span className="text-green-700 font-medium">Assigned & Confirmed</span>
                                    </p>
                                </div>
                            </div>

                            <a
                                href={`tel:${booking.assignedPanditId.phone}`}
                                className="w-full sm:w-auto mt-2 sm:mt-0 px-6 py-2.5 bg-warm-900 hover:bg-black text-white rounded-xl font-medium text-sm transition-colors text-center shadow-md flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Contact Pandit
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
