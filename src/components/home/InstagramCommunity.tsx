"use client";

const INSTAGRAM_POSTS = [
    { id: "ig1", image: "" },
    { id: "ig2", image: "" },
    { id: "ig3", image: "" },
    { id: "ig4", image: "" },
    { id: "ig5", image: "" },
    { id: "ig6", image: "" },
];

export function InstagramCommunity() {
    return (
        <section className="section-shell overflow-hidden">
            <div className="section-wrap">
                <div className="text-center mb-8">
                    <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-full mb-3 shadow-sm border border-pink-200">
                        <svg
                            className="size-6 text-pink-600"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                    </div>
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-warm-900 mb-2">
                        Join Our Spiritual Community
                    </h2>
                    <p className="text-sm text-warm-600">
                        Follow <a href="https://instagram.com/sanatansetu" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">@sanatansetu</a> on Instagram
                    </p>
                </div>

                {/* Carousel / Grid container */}
                <div className="flex overflow-x-auto gap-3 pb-4 snap-x snap-mandatory no-scrollbar md:grid md:grid-cols-6 md:gap-4 md:overflow-visible">
                    {INSTAGRAM_POSTS.map((post) => (
                        <a
                            key={post.id}
                            href="https://instagram.com/sanatansetu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative w-48 shrink-0 snap-center md:w-auto h-48 md:h-auto md:aspect-square bg-warm-100 rounded-2xl overflow-hidden group border border-warm-200 shadow-sm block"
                        >
                            {post.image ? (
                                <img
                                    src={post.image}
                                    alt="Community Image"
                                    loading="lazy"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-warm-100 to-saffron-50 flex items-center justify-center p-4">
                                    <div className="text-center group-hover:scale-110 transition-transform duration-500">
                                        <div className="text-3xl mb-2 opacity-80">🙏</div>
                                        <p className="text-[10px] font-bold text-warm-600 opacity-60">Customer Photo</p>
                                    </div>
                                </div>
                            )}
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                <svg className="size-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                </svg>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
