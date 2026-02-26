"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";

function extractYouTubeId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

export function VideoExperienceClient({ videos }: { videos: any[] }) {
    const [activeVideo, setActiveVideo] = useState<any | null>(null);

    if (!videos || videos.length === 0) return null;

    return (
        <div className="mb-10 lg:mb-16">
            <h3 className="mb-6 font-heading text-2xl font-bold text-warm-900 md:text-3xl text-center md:text-left">🎥 Video Experiences</h3>

            <div className="flex gap-4 overflow-x-auto pb-6 pt-2 px-2 -mx-2 no-scrollbar snap-x snap-mandatory">
                {videos.map((vid: any) => (
                    <div
                        key={vid._id.toString()}
                        onClick={() => setActiveVideo(vid)}
                        className="group relative min-w-[260px] max-w-[280px] flex-shrink-0 snap-center md:snap-start overflow-hidden rounded-2xl bg-warm-100 aspect-[3/4] sm:min-w-[300px] sm:max-w-none sm:aspect-video cursor-pointer shadow-md transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ring-1 ring-warm-200/50 hover:ring-saffron-300"
                    >
                        <img
                            src={vid.thumbnailUrl || "/images/reviews/placeholder.jpg"}
                            alt={vid.name}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-warm-900/90 via-warm-900/30 to-transparent" />

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex size-16 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-saffron-500/90 shadow-[0_0_30px_rgba(255,255,255,0.3)] group-hover:shadow-[0_0_40px_rgba(249,115,22,0.5)]">
                                <Play fill="currentColor" size={28} className="ml-1" />
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                            <p className="font-bold text-white text-lg tracking-wide">{vid.name}</p>
                            <p className="text-sm text-saffron-300 font-medium line-clamp-1">{vid.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={!!activeVideo} onOpenChange={(open) => !open && setActiveVideo(null)}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none rounded-2xl shadow-2xl">
                    <DialogTitle className="sr-only">Video Testimonial</DialogTitle>
                    <button
                        onClick={() => setActiveVideo(null)}
                        className="absolute top-4 right-4 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/80 backdrop-blur-md transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="relative pt-[56.25%] w-full bg-warm-900">
                        {activeVideo && (
                            <iframe
                                src={
                                    extractYouTubeId(activeVideo.videoUrl)
                                        ? `https://www.youtube.com/embed/${extractYouTubeId(activeVideo.videoUrl)}?autoplay=1&rel=0`
                                        : activeVideo.videoUrl
                                }
                                className="absolute inset-0 w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        )}
                    </div>

                    {activeVideo && (
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
                            <h4 className="text-xl font-bold text-white">{activeVideo.name}</h4>
                            <p className="text-saffron-400">{activeVideo.title}</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
