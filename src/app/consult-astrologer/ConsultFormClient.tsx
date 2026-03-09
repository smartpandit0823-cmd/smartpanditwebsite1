"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, CheckCircle } from "lucide-react";

const FormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Valid phone num required"),
    birthDate: z.string().min(1, "Birth date required"),
    birthTime: z.string().optional(),
    birthPlace: z.string().min(2, "Birth place required"),
    problemCategory: z.string().min(1, "Select category"),
    notes: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export function ConsultFormClient() {
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
    });

    const onSubmit = async (data: FormValues) => {
        setErrorMsg(null);
        try {
            const res = await fetch("/api/astrology-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const responseData = await res.json();
            if (!res.ok) {
                throw new Error(responseData.error || "Submission failed");
            }

            setSuccessMsg("Our astrologer will contact you in 1 hours");
            reset();
        } catch (e: any) {
            setErrorMsg(e.message || "Failed to submit request.");
        }
    };

    if (successMsg) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-10 px-4 min-h-[300px]">
                <CheckCircle className="text-green-500 w-20 h-20 mb-4 animate-bounce" />
                <h2 className="text-3xl font-heading font-bold text-[#1A1A1A] mb-3">
                    Request Submitted!
                </h2>
                <p className="text-lg text-green-700 font-medium">{successMsg}</p>
                <button
                    onClick={() => setSuccessMsg(null)}
                    className="mt-8 px-6 py-2.5 rounded-full border-2 border-[#FF8C00] text-[#FF8C00] font-bold hover:bg-orange-50 transition-colors"
                >
                    Book Another Session
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {errorMsg && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center text-sm font-bold border border-red-100">
                    {errorMsg}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        Full Name *
                    </label>
                    <input
                        {...register("name")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#FF8C00] focus:ring-[#FF8C00] focus:ring-1 outline-none transition-all"
                        placeholder="Rahul Sharma"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        Phone Number *
                    </label>
                    <input
                        {...register("phone")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#FF8C00] focus:ring-[#FF8C00] focus:ring-1 outline-none transition-all"
                        placeholder="+91 9876543210"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        Email Address *
                    </label>
                    <input
                        {...register("email")}
                        type="email"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#FF8C00] focus:ring-[#FF8C00] focus:ring-1 outline-none transition-all"
                        placeholder="rahul@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        Problem Category *
                    </label>
                    <select
                        {...register("problemCategory")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#FF8C00] focus:ring-[#FF8C00] focus:ring-1 outline-none transition-all"
                    >
                        <option value="">Select an area...</option>
                        <option value="Wealth & Finance">Wealth & Finance</option>
                        <option value="Career & Business">Career & Business</option>
                        <option value="Love & Marriage">Love & Marriage</option>
                        <option value="Health & Healing">Health & Healing</option>
                        <option value="Vastu Dosha">Vastu Dosha</option>
                        <option value="General Kundali Reading">General Kundali Reading</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.problemCategory && <p className="text-red-500 text-xs mt-1">{errors.problemCategory.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        Date of Birth *
                    </label>
                    <input
                        {...register("birthDate")}
                        type="date"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#FF8C00] focus:ring-[#FF8C00] focus:ring-1 outline-none transition-all"
                    />
                    {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                        Time of Birth (Optional)
                    </label>
                    <input
                        {...register("birthTime")}
                        type="time"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#FF8C00] focus:ring-[#FF8C00] focus:ring-1 outline-none transition-all"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Place of Birth * (City, State, Country)
                </label>
                <input
                    {...register("birthPlace")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#FF8C00] focus:ring-[#FF8C00] focus:ring-1 outline-none transition-all"
                    placeholder="New Delhi, Delhi, India"
                />
                {errors.birthPlace && <p className="text-red-500 text-xs mt-1">{errors.birthPlace.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Any specific questions? (Message)
                </label>
                <textarea
                    {...register("notes")}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#FF8C00] focus:ring-[#FF8C00] focus:ring-1 outline-none transition-all resize-none"
                    placeholder="Briefly describe your concern..."
                ></textarea>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FF8C00] py-4 rounded-xl text-white font-bold text-lg hover:bg-[#E67E00] shadow-[0_4px_16px_rgba(255,140,0,0.3)] transition-all flex justify-center items-center mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" /> Submitting...
                    </>
                ) : (
                    "Book Consultation Now"
                )}
            </button>
            <p className="text-center text-xs text-gray-500 flex justify-center mt-4">
                🔒 Your details are 100% private and confidential.
            </p>
        </form>
    );
}
