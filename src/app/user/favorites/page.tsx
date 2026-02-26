"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, Flame, ShoppingBag, Loader2 } from "lucide-react";

export default function FavoritesPage() {
    const { user, loading: authLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) router.push("/user/login");
    }, [user, authLoading, router]);

    if (authLoading) {
        return <div className="flex min-h-[60dvh] items-center justify-center"><Loader2 className="size-8 animate-spin text-saffron-500" /></div>;
    }

    return (
        <div className="mx-auto max-w-lg px-4 py-6 space-y-5">
            <div className="flex items-center gap-3">
                <Link href="/user/profile" className="flex size-9 items-center justify-center rounded-full bg-white shadow-sm border border-warm-100">
                    <ArrowLeft size={18} />
                </Link>
                <h1 className="text-lg font-semibold text-warm-900">Favorites</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                <button className="flex items-center gap-1.5 rounded-full bg-saffron-600 px-4 py-2 text-xs font-medium text-white">
                    <Flame size={14} /> Pujas
                </button>
                <button className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-medium text-warm-600 border border-warm-200">
                    <ShoppingBag size={14} /> Products
                </button>
            </div>

            {/* Empty state */}
            <div className="py-16 text-center">
                <Heart className="mx-auto mb-3 text-warm-300" size={40} />
                <p className="text-sm text-warm-500">No favorites yet</p>
                <p className="mt-1 text-xs text-warm-400">Tap ❤️ on any puja or product to save it here</p>
                <Link href="/puja" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-saffron-600 px-4 py-2 text-sm font-medium text-white">
                    <Flame size={14} /> Browse Pujas
                </Link>
            </div>
        </div>
    );
}
