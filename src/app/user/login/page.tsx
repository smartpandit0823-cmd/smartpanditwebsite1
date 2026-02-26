"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Flame, ArrowLeft, Smartphone, Loader2 } from "lucide-react";
import Link from "next/link";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

type Step = "phone" | "otp" | "name";

export default function UserLoginPage() {
    const router = useRouter();
    const { refresh } = useUser();

    const [step, setStep] = useState<Step>("phone");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState(0);
    const [devOtp, setDevOtp] = useState("");
    const [googleData, setGoogleData] = useState<any>(null);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) return;
        const t = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(t);
    }, [countdown]);

    // Auto-focus first OTP box
    useEffect(() => {
        if (step === "otp") otpRefs.current[0]?.focus();
    }, [step]);

    async function sendOtp() {
        if (phone.length < 10) {
            setError("Enter a valid 10-digit phone number");
            return;
        }
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Failed to send OTP");
                setLoading(false);
                return;
            }
            // In dev mode, OTP is logged to console
            if (data.devOtp) setDevOtp(data.devOtp);
            setCountdown(60);
            setStep("otp");
        } catch {
            setError("Network error. Please try again.");
        }
        setLoading(false);
    }

    function handleOtpChange(index: number, value: string) {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-advance
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all filled
        if (newOtp.every((d) => d) && newOtp.join("").length === 6) {
            verifyOtp(newOtp.join(""));
        }
    }

    function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    }

    async function verifyOtp(otpCode?: string) {
        const code = otpCode || otp.join("");
        if (code.length !== 6) {
            setError("Enter the 6-digit OTP");
            return;
        }
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone,
                    otp: code,
                    name: name || undefined,
                    googleData: googleData || undefined
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Invalid OTP");
                setOtp(["", "", "", "", "", ""]);
                otpRefs.current[0]?.focus();
                setLoading(false);
                return;
            }

            await refresh();

            // If new user (no name), ask for name
            if (!data.user?.name) {
                setStep("name");
                setLoading(false);
                return;
            }

            router.push("/");
            router.refresh();
        } catch {
            setError("Verification failed");
        }
        setLoading(false);
    }

    async function saveProfile() {
        if (!name.trim()) {
            setError("Please enter your name");
            return;
        }
        setError("");
        setLoading(true);

        try {
            await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim() }),
            });
            await refresh();
            router.push("/");
            router.refresh();
        } catch {
            setError("Failed to update. Please try again.");
        }
        setLoading(false);
    }

    async function handleGoogleSuccess(credentialResponse: any) {
        if (!credentialResponse.credential) {
            setError("Google login failed");
            return;
        }
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential: credentialResponse.credential }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Google login failed");
                setLoading(false);
                return;
            }
            if (data.requirePhone) {
                setGoogleData(data.googleData);
                setStep("phone");
                setLoading(false);
                setError("Please link your mobile number to complete Google Sign In.");
                return;
            }

            await refresh();
            if (data.isNewUser && !data.user?.name) {
                setStep("name");
                setLoading(false);
                return;
            }
            router.push("/");
            router.refresh();
        } catch {
            setError("Network error. Please try again.");
            setLoading(false);
        }
    }

    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <div className="flex min-h-dvh flex-col bg-gradient-to-b from-[#fffdf7] to-saffron-50/30">
                {/* Top bar */}
                <div className="flex items-center gap-3 px-4 py-4">
                    <button
                        onClick={() => {
                            if (step === "otp") { setStep("phone"); setOtp(["", "", "", "", "", ""]); }
                            else if (step === "name") { router.push("/"); }
                            else router.back();
                        }}
                        className="flex size-9 items-center justify-center rounded-full bg-white shadow-sm"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <span className="text-sm text-warm-500">
                        {step === "phone" ? "Login / Sign Up" : step === "otp" ? "Verify OTP" : "Complete Profile"}
                    </span>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center px-6 pb-12">
                    {/* Logo */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-saffron-500 to-gold-500 text-3xl shadow-lg shadow-saffron-200/50">
                            🙏
                        </div>
                        <h1 className="font-heading text-2xl font-bold text-warm-900">SmartPandit</h1>
                        <p className="mt-1 text-sm text-warm-500">Trusted Spiritual Services</p>
                    </div>

                    {/* ── STEP 1: Phone Input ── */}
                    {step === "phone" && (
                        <div className="w-full max-w-sm space-y-5">
                            <div className="text-center">
                                <h2 className="text-lg font-semibold text-warm-900">Enter Phone Number</h2>
                                <p className="mt-1 text-sm text-warm-500">We'll send a 6-digit OTP to verify</p>
                            </div>

                            <div className="relative">
                                <div className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5 text-sm text-warm-500">
                                    <Smartphone size={16} />
                                    +91
                                </div>
                                <Input
                                    type="tel"
                                    maxLength={10}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                    onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                                    placeholder="Enter 10-digit number"
                                    className="h-14 rounded-xl pl-20 text-lg tracking-wider"
                                    autoFocus
                                />
                            </div>

                            {error && <p className="text-center text-sm text-red-500">{error}</p>}

                            <Button
                                onClick={sendOtp}
                                disabled={loading || phone.length < 10}
                                className="h-13 w-full rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 text-base font-semibold shadow-lg shadow-saffron-200/50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : "Send OTP"}
                            </Button>

                            {!googleData && (
                                <>
                                    {/* Divider */}
                                    <div className="flex items-center gap-3">
                                        <div className="h-px flex-1 bg-warm-200" />
                                        <span className="text-xs text-warm-400">or</span>
                                        <div className="h-px flex-1 bg-warm-200" />
                                    </div>

                                    {/* Google Login */}
                                    <div className="flex justify-center w-full">
                                        <GoogleLogin
                                            onSuccess={handleGoogleSuccess}
                                            onError={() => setError("Google Sign-In was unsuccessful. Please try again.")}
                                            theme="outline"
                                            size="large"
                                            text="continue_with"
                                            shape="pill"
                                            width="340"
                                        />
                                    </div>
                                </>
                            )}

                            <p className="text-center text-[11px] text-warm-400">
                                By continuing, you agree to our{" "}
                                <Link href="/terms" className="text-saffron-600 underline">Terms</Link> &{" "}
                                <Link href="/privacy-policy" className="text-saffron-600 underline">Privacy Policy</Link>
                            </p>
                        </div>
                    )}

                    {/* ── STEP 2: OTP Input ── */}
                    {step === "otp" && (
                        <div className="w-full max-w-sm space-y-6">
                            <div className="text-center">
                                <h2 className="text-lg font-semibold text-warm-900">Verify OTP</h2>
                                <p className="mt-1 text-sm text-warm-500">
                                    Sent to <span className="font-medium text-warm-700">+91 {phone}</span>
                                </p>
                            </div>

                            {/* OTP Boxes */}
                            <div className="flex justify-center gap-2.5">
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => { otpRefs.current[i] = el; }}
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                        className="size-12 rounded-xl border-2 border-warm-200 bg-white text-center text-xl font-bold text-warm-900 shadow-sm transition-all focus:border-saffron-500 focus:outline-none focus:ring-2 focus:ring-saffron-200"
                                    />
                                ))}
                            </div>

                            {devOtp && (
                                <div className="rounded-lg bg-blue-50 p-2.5 text-center text-xs text-blue-700">
                                    Dev OTP: <span className="font-mono font-bold">{devOtp}</span>
                                </div>
                            )}

                            {error && <p className="text-center text-sm text-red-500">{error}</p>}

                            <Button
                                onClick={() => verifyOtp()}
                                disabled={loading || otp.join("").length !== 6}
                                className="h-13 w-full rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 text-base font-semibold"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : "Verify & Login"}
                            </Button>

                            <div className="text-center">
                                {countdown > 0 ? (
                                    <p className="text-sm text-warm-400">Resend in {countdown}s</p>
                                ) : (
                                    <button
                                        onClick={sendOtp}
                                        className="text-sm font-medium text-saffron-600"
                                    >
                                        Resend OTP
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── STEP 3: Name (New User) ── */}
                    {step === "name" && (
                        <div className="w-full max-w-sm space-y-5">
                            <div className="text-center">
                                <h2 className="text-lg font-semibold text-warm-900">Welcome! 🙏</h2>
                                <p className="mt-1 text-sm text-warm-500">What should we call you?</p>
                            </div>

                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && saveProfile()}
                                placeholder="Enter your name"
                                className="h-14 rounded-xl text-lg"
                                autoFocus
                            />

                            {error && <p className="text-center text-sm text-red-500">{error}</p>}

                            <Button
                                onClick={saveProfile}
                                disabled={loading || !name.trim()}
                                className="h-13 w-full rounded-xl bg-gradient-to-r from-saffron-500 to-saffron-600 text-base font-semibold"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : "Get Started"}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}
