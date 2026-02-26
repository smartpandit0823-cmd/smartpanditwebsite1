"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IndianRupee, MessageCircle, FileText, Upload } from "lucide-react";
import { paymentToPanditWhatsAppMessage, generateWhatsAppLink } from "@/lib/whatsapp";

interface PayoutActionFormProps {
    bookingId: string;
    pandit: { _id: string; name: string; phone: string; upiId?: string; bankDetails?: any };
    amountReceived: number;
    pujaName: string;
}

export function PayoutActionForm({ bookingId, pandit, amountReceived, pujaName }: PayoutActionFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState("");
    const [utr, setUtr] = useState("");
    const [note, setNote] = useState("");
    const [success, setSuccess] = useState("");

    const suggestedPayout = amountReceived * 0.8; // e.g. 80% to pandit by default

    const handleMarkPaid = async () => {
        if (!amount || isNaN(Number(amount))) return;
        setLoading(true);

        const payload = {
            payoutAmount: Number(amount),
            utrNumber: utr,
            note: note,
        };

        const res = await fetch(`/api/admin/bookings/${bookingId}/payout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        setLoading(false);

        if (res.ok) {
            setSuccess("Payment marked and tracked successfully! ✅");
        }
    };

    const handleWhatsApp = () => {
        if (!pandit.phone) return;
        const msg = paymentToPanditWhatsAppMessage(
            pandit.name,
            Number(amount) || suggestedPayout,
            pujaName,
            utr,
            note
        );
        const link = generateWhatsAppLink(pandit.phone, msg);
        window.open(link, "_blank");
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="rounded-full bg-green-100 p-3">
                    <IndianRupee className="w-8 h-8 text-green-600" />
                </div>
                <div>
                    <h4 className="font-bold text-lg text-green-900">Payment Saved!</h4>
                    <p className="text-sm text-green-700">Platform fee & metrics updated.</p>
                </div>
                <Button onClick={handleWhatsApp} className="w-full bg-[#25D366] hover:bg-[#128C7E]">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send WhatsApp Note
                </Button>
                <Button variant="outline" className="w-full mt-2" onClick={() => router.refresh()}>
                    Next Payout
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h4 className="flex items-center gap-2 font-bold text-warm-900 border-b pb-2">
                <Upload className="w-4 h-4 text-saffron-500" />
                Process Payout
            </h4>

            <div className="space-y-3 pt-2">
                <div>
                    <Label className="text-xs text-gray-500 mb-1">Pandit Cut (₹)</Label>
                    <div className="relative">
                        <Input
                            type="number"
                            placeholder={`e.g. ${suggestedPayout}`}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="pl-8"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400">₹</span>
                    </div>
                </div>

                <div>
                    <Label className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> UTR / Transaction No.
                    </Label>
                    <Input
                        placeholder="e.g. UPI-1234567890"
                        value={utr}
                        onChange={(e) => setUtr(e.target.value)}
                    />
                </div>

                <div>
                    <Label className="text-xs text-gray-500 mb-1">Internal Note (Optional)</Label>
                    <Input
                        placeholder="Platform fee 20% + transport"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>

                <div className="bg-orange-50 p-2 rounded text-[10px] text-orange-800 flex justify-between tracking-wide font-medium">
                    <span>Platform Profit:</span>
                    <span>
                        {amount ? formatCurrency(amountReceived - Number(amount)) : formatCurrency(amountReceived)}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button onClick={handleMarkPaid} disabled={loading || !amount} className="w-full bg-green-600 hover:bg-green-700 col-span-2">
                        Mark as Paid
                    </Button>
                </div>
            </div>
        </div>
    );
}
