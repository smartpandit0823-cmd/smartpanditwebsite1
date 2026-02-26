import Link from "next/link";
import { Star, MapPin, CheckCircle2, UserPlus } from "lucide-react";
import connectDB from "@/lib/db/mongodb";
import Pandit from "@/models/Pandit";

export async function OurPandits() {
    await connectDB();
    // Fetch up to 4 verified pandits for the home page
    const pandits = await Pandit.find({ verificationStatus: "verified" })
        .select("name photo city specializations experience")
        .limit(4)
        .lean() as any[];

    return (
        <section id="our-pandits" className="bg-warm-50 py-10 md:py-16">
            <div className="section-wrap">
                <div className="mb-12 text-center">
                    <h2 className="font-heading text-3xl font-bold text-warm-900 md:text-5xl">Our Verified Pandits</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-warm-600 text-lg">
                        Experienced, highly qualified, and rigorously verified spiritual guides for your sacred rituals.
                    </p>
                </div>

                <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
                    {pandits.map((pandit: any) => (
                        <div key={pandit._id.toString()} className="group overflow-hidden flex flex-col items-center justify-between rounded-[1.5rem] border border-warm-200 bg-white p-4 sm:p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-saffron-300">
                            <div className="w-full flex flex-col items-center">
                                <div className="mb-4 sm:mb-6 flex items-center justify-center">
                                    <div className="relative size-20 sm:size-28 overflow-hidden rounded-full border-4 border-saffron-50 p-1 group-hover:border-saffron-200 transition-colors">
                                        {pandit.photo ? (
                                            <img src={pandit.photo} alt={pandit.name} className="h-full w-full rounded-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center rounded-full bg-saffron-100 text-3xl sm:text-4xl font-bold text-saffron-600">
                                                {pandit.name?.charAt(0) || "P"}
                                            </div>
                                        )}
                                        <div className="absolute bottom-1 right-1 rounded-full bg-white p-[2px] shadow-sm">
                                            <CheckCircle2 size={20} className="text-blue-500 fill-white sm:w-6 sm:h-6" />
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-center font-heading text-lg sm:text-xl font-bold text-warm-900 line-clamp-1">{pandit.name}</h3>

                                <div className="mt-1 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium text-warm-500">
                                    <MapPin size={14} className="text-saffron-400 sm:w-4 sm:h-4" /> {pandit.city || "India"}
                                </div>

                                <div className="mt-2 text-center text-xs font-semibold text-saffron-600 bg-saffron-50 px-2 py-1 rounded-md">
                                    {pandit.experience}+ Years Exp.
                                </div>

                                {(pandit.specializations && pandit.specializations.length > 0) && (
                                    <div className="mt-3 flex flex-wrap items-center justify-center gap-1">
                                        {pandit.specializations.slice(0, 2).map((s: string, i: number) => (
                                            <span key={i} className="text-[10px] sm:text-xs bg-warm-100 text-warm-700 px-2 py-0.5 rounded-full line-clamp-1 border border-warm-200">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {pandits.length === 0 && (
                        <div className="col-span-full py-12 text-center text-warm-500">
                            More verified Pandits joining soon.
                        </div>
                    )}
                </div>

                <div className="mt-10 sm:mt-16 flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row">
                    <Link href="/join-pandit" className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-saffron-500 px-6 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-white shadow-lg transition-all hover:bg-saffron-600 hover:scale-105 hover:shadow-xl">
                        <UserPlus size={18} className="transition-transform group-hover:scale-110 sm:w-5 sm:h-5" />
                        Join as Pandit
                    </Link>
                    <Link href="/team" className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 border-saffron-200 bg-white px-6 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-saffron-700 transition hover:bg-saffron-50 hover:border-saffron-300">
                        View All Pandits
                    </Link>
                </div>
            </div>
        </section>
    );
}
