"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft, Globe, Shield, LogOut, Trash2, ChevronRight, Loader2,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
    const { user, loading: authLoading, logout } = useUser();
    const router = useRouter();
    const [language, setLanguage] = useState("hi");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) router.push("/user/login");
    }, [user, authLoading, router]);

    async function handleLogout() {
        await logout();
        router.push("/");
    }

    async function handleDeleteAccount() {
        if (!confirm("Are you sure? This action cannot be undone. All your data will be permanently deleted.")) return;
        // TODO: Call delete API
        await logout();
        router.push("/");
    }

    if (authLoading) {
        return <div className="flex min-h-[60dvh] items-center justify-center"><Loader2 className="size-8 animate-spin text-saffron-500" /></div>;
    }

    return (
        <div className="mx-auto max-w-lg px-4 py-6 space-y-5">
            <div className="flex items-center gap-3">
                <Link href="/user/profile" className="flex size-9 items-center justify-center rounded-full bg-white shadow-sm border border-warm-100">
                    <ArrowLeft size={18} />
                </Link>
                <h1 className="text-lg font-semibold text-warm-900">Settings</h1>
            </div>

            {/* Language */}
            <div className="rounded-2xl border border-gold-200/50 bg-white p-4">
                <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Globe size={18} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-warm-900">Language</p>
                        <p className="text-xs text-warm-400">Choose app language</p>
                    </div>
                    <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-28 h-9 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="hi">Hindi</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="mr">Marathi</SelectItem>
                            <SelectItem value="gu">Gujarati</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Security */}
            <div className="rounded-2xl border border-gold-200/50 bg-white overflow-hidden">
                <div className="px-4 py-3 border-b border-warm-100">
                    <p className="text-xs font-semibold uppercase tracking-wider text-warm-400">Security</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition active:bg-warm-50"
                >
                    <div className="flex size-9 items-center justify-center rounded-xl bg-saffron-50 text-saffron-600">
                        <LogOut size={18} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-warm-900">Logout</p>
                        <p className="text-xs text-warm-400">Sign out from this device</p>
                    </div>
                    <ChevronRight size={14} className="text-warm-300" />
                </button>
                <button
                    onClick={handleDeleteAccount}
                    className="flex w-full items-center gap-3 border-t border-warm-100 px-4 py-3.5 text-left transition active:bg-red-50"
                >
                    <div className="flex size-9 items-center justify-center rounded-xl bg-red-50 text-red-500">
                        <Trash2 size={18} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-red-600">Delete Account</p>
                        <p className="text-xs text-warm-400">Permanently remove your data</p>
                    </div>
                    <ChevronRight size={14} className="text-warm-300" />
                </button>
            </div>

            {/* App Info */}
            <div className="rounded-2xl border border-gold-200/50 bg-white p-4">
                <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-warm-100 text-warm-500">
                        <Shield size={18} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-warm-900">SmartPandit v1.0</p>
                        <p className="text-xs text-warm-400">Licensed spiritual platform</p>
                    </div>
                </div>
            </div>

            <div className="text-center space-y-1 pt-4">
                <Link href="/terms" className="text-xs text-saffron-600 underline">Terms of Service</Link>
                <span className="text-xs text-warm-300"> · </span>
                <Link href="/privacy-policy" className="text-xs text-saffron-600 underline">Privacy Policy</Link>
                <p className="text-[10px] text-warm-400 mt-2">Made with 🙏 in India</p>
            </div>
        </div>
    );
}
