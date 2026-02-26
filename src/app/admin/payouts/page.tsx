import connectDB from "@/lib/db/mongodb";
import Booking from "@/models/Booking";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/index";
import { PayoutActionForm } from "./PayoutActionForm";

export const dynamic = "force-dynamic";

export default async function AdminPayoutsPage() {
    await connectDB();

    // Fetch pending payouts (full payments where pandit is assigned but not paid yet)
    // For advance payments, the pandit collects the remaining cash, so platform payout might not be needed.
    // However, we can show anything that needs payout.
    const pendingPayoutsDoc = await Booking.find({
        status: { $nin: ["cancelled"] },
        paymentType: "full",
        amountPaid: { $gt: 0 },
        panditPayoutStatus: "pending",
        assignedPanditId: { $exists: true },
    })
        .populate("assignedPanditId", "name phone bankDetails upiId")
        .populate("userId", "name phone")
        .populate({ path: "pujaId", select: "name" })
        .sort({ date: 1 })
        .lean();

    const pendingPayouts = JSON.parse(JSON.stringify(pendingPayoutsDoc));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="font-heading text-2xl sm:text-3xl font-bold text-warm-900">Pandit Payouts</h1>
                    <p className="mt-0.5 text-sm text-gray-500">Manage pending payments to Pandits</p>
                </div>
            </div>

            <div className="grid gap-6">
                {!pendingPayouts.length ? (
                    <Card className="bg-green-50/50 border-green-100">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="rounded-full bg-green-100 p-3 mb-4">
                                <span className="text-2xl">🎉</span>
                            </div>
                            <h3 className="text-lg font-bold text-green-900">All Caught Up!</h3>
                            <p className="text-sm text-green-700 mt-1">No pending payouts for full payments.</p>
                        </CardContent>
                    </Card>
                ) : (
                    pendingPayouts.map((booking: any) => {
                        const amountToPay = booking.amountPaid; // Admin needs to keep platform fee and pay rest

                        return (
                            <Card key={booking._id} className="overflow-hidden border-orange-200 shadow-sm">
                                <div className="bg-orange-50/50 border-b border-orange-100 px-5 py-3 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-[10px] bg-white text-orange-700 border-orange-200">
                                            {booking.bookingId}
                                        </Badge>
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 text-[10px]">
                                            FULL PAID BY USER
                                        </Badge>
                                    </div>
                                    <span className="text-xs font-medium text-gray-500">
                                        {new Date(booking.date).toLocaleDateString("en-IN", {
                                            day: "numeric", month: "long", year: "numeric"
                                        })}
                                    </span>
                                </div>
                                <CardContent className="p-0 flex flex-col md:flex-row">
                                    <div className="p-5 flex-1 md:border-r border-gray-100 space-y-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-warm-900">{booking.pujaId?.name || "Puja"}</h3>
                                            <p className="text-sm text-warm-600">Amount Received: <span className="font-bold text-green-700">{formatCurrency(booking.amountPaid)}</span></p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 bg-warm-50 rounded-lg p-3">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">Pandit Details</p>
                                                <p className="text-sm font-bold text-warm-900">{booking.assignedPanditId?.name}</p>
                                                <p className="text-xs text-warm-600">{booking.assignedPanditId?.phone}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1">Customer Details</p>
                                                <p className="text-sm font-medium text-warm-900">{booking.userId?.name}</p>
                                                <p className="text-xs text-warm-600">{booking.userId?.phone}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 bg-gray-50 md:w-[350px]">
                                        <PayoutActionForm
                                            bookingId={booking._id}
                                            pandit={booking.assignedPanditId}
                                            amountReceived={booking.amountPaid}
                                            pujaName={booking.pujaId?.name || "Puja"}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
