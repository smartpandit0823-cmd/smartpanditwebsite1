import { ConsultFormClient } from "./ConsultFormClient";

export const metadata = {
    title: "Consult Astrologer - Sanatan Setu",
    description: "Get personalized guidance from our expert Vedic Astrologers.",
};

export default function ConsultAstrologerPage() {
    return (
        <div className="min-h-screen bg-[#FEFAF4] lg:pt-10">
            <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#1A1A1A] mb-4">
                        Consult <span className="text-[#FF8C00]">Astrologer</span>
                    </h1>
                    <p className="text-[#888888] text-lg font-medium max-w-xl mx-auto">
                        Share your birth details for a personalized Kundali reading and deeply accurate Vedic guidance.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl shadow-orange-100/50 p-6 md:p-10 border border-orange-50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-saffron-100 rounded-bl-full -z-10 opacity-30 pointer-events-none"></div>

                    <ConsultFormClient />
                </div>
            </div>
        </div>
    );
}
