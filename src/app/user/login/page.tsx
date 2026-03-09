"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Smartphone, Loader2, Mail, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

type Step = "phone" | "otp" | "name";

function LoginContent() {
    const router = useRouter();
    const { refresh } = useUser();

    const [step, setStep] = useState<Step>("phone");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState(0);
    const [devOtp, setDevOtp] = useState(""); // <--- Storing OTP for UI display
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

    // ── Send OTP ──
    const sendOtp = async () => {
        if (phone.length < 10) {
            setError("Enter a valid 10-digit phone number");
            return;
        }
        setError("");
        setLoading(true);
        setDevOtp(""); // Reset

        try {
            const res = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: `91${phone}` }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to send OTP. Try again.");
                setLoading(false);
                return;
            }

            // In dev environment, API returns the OTP
            if (data.devOtp) {
                setDevOtp(data.devOtp);
            }

            setOtp(["", "", "", "", "", ""]);
            setCountdown(60);
            setStep("otp");
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ── OTP Input Handlers ──
    function handleOtpChange(index: number, value: string) {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }

        if (newOtp.every((d) => d) && newOtp.join("").length === 6) {
            verifyOtp(newOtp.join(""));
        }
    }

    function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    }

    // ── Verify OTP ──
    async function verifyOtp(otpCode?: string) {
        const code = otpCode || otp.join("");
        if (code.length !== 6) {
            setError("Enter the 6-digit OTP");
            return;
        }
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone: `91${phone}`,
                    otp: code,
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Invalid OTP. Try again.");
                setOtp(["", "", "", "", "", ""]);
                otpRefs.current[0]?.focus();
                setLoading(false);
                return;
            }

            await refresh();

            if (!data.user?.name) {
                setStep("name");
                setLoading(false);
                return;
            }

            router.push("/");
            router.refresh();
        } catch {
            setError("Verification failed. Try again.");
            setOtp(["", "", "", "", "", ""]);
            otpRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    }

    // ── Google Login Success ──
    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            setError("");
            setLoading(true);

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
                // If new user needs phone number linked
                setName(data.googleData.name);
                setEmail(data.googleData.email);
                setStep("phone"); // Needs phone mapping - for our simpler flow, just show phone step
                setError("Please link your phone number to complete signup");
                setLoading(false);
                return;
            }

            await refresh();
            router.push("/");
            router.refresh();
        } catch {
            setError("Google Login Error");
            setLoading(false);
        }
    };

    // ── Save Profile (New User) ──
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
                body: JSON.stringify({ name: name.trim(), email: email.trim() || undefined }),
            });
            await refresh();
            router.push("/");
            router.refresh();
        } catch {
            setError("Failed to save. Try again.");
        }
        setLoading(false);
    }

    const goBack = () => {
        if (step === "otp") {
            setStep("phone");
            setOtp(["", "", "", "", "", ""]);
            setError("");
        } else if (step === "name") {
            router.push("/");
        } else {
            router.back();
        }
    };

    return (
        <div className="flex min-h-dvh flex-col bg-gradient-to-b from-[#fffdf7] to-orange-50/30">
            {/* Top bar */}
            <div className="flex items-center gap-3 px-4 py-4">
                <button
                    onClick={goBack}
                    className="flex size-9 items-center justify-center rounded-full bg-white shadow-sm"
                    disabled={loading && step !== "name"}
                >
                    <ArrowLeft size={18} />
                </button>
                <span className="text-sm text-gray-500">
                    {step === "phone" ? "Login / Sign Up" : step === "otp" ? "Verify OTP" : "Complete Profile"}
                </span>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center px-6 pb-12">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF8C00] to-[#E67E00] text-3xl shadow-lg shadow-orange-200/50">
                        🙏
                    </div>
                    <h1 className="font-heading text-2xl font-bold text-gray-900">SanatanSetu</h1>
                    <p className="mt-1 text-sm text-gray-500">Trusted Spiritual Services</p>
                </div>

                {/* ── STEP 1: Phone Input ── */}
                {step === "phone" && (
                    <div className="w-full max-w-sm space-y-5">
                        <div className="text-center">
                            <h2 className="text-lg font-semibold text-gray-900">Enter Phone Number</h2>
                            <p className="mt-1 text-sm text-gray-500">We&apos;ll send a 6-digit OTP to verify</p>
                        </div>

                        <div className="relative">
                            <div className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5 text-sm text-gray-500">
                                <Smartphone size={16} />
                                +91
                            </div>
                            <Input
                                type="tel"
                                maxLength={10}
                                value={phone}
                                onChange={(e) => {
                                    setPhone(e.target.value.replace(/\D/g, ""));
                                    if (error) setError("");
                                }}
                                onKeyDown={(e) => e.key === "Enter" && sendOtp()}
                                placeholder="Enter 10-digit number"
                                className="h-14 rounded-xl pl-20 text-lg tracking-wider bg-white"
                                autoFocus
                            />
                        </div>

                        {error && <p className="text-center text-sm font-medium text-red-500 bg-red-50/50 py-2 rounded-lg">{error}</p>}

                        <Button
                            onClick={sendOtp}
                            disabled={loading || phone.length !== 10}
                            className="h-13 w-full rounded-xl bg-gradient-to-r from-[#FF8C00] to-[#E67E00] text-base font-semibold shadow-lg shadow-orange-200/50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Continue"}
                        </Button>

                        <div className="relative my-6 flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <span className="relative bg-[#fffdf7] px-4 text-xs font-semibold uppercase text-gray-400">
                                OR
                            </span>
                        </div>

                        <div className="w-full flex justify-center">
                            {/* Google Sign In Button */}
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError("Google Login Failed")}
                                useOneTap={false}
                                shape="pill"
                                theme="filled_blue"
                                size="large"
                                width="350px"
                            />
                        </div>

                        <p className="text-center text-[11px] text-gray-400 pt-4">
                            By continuing, you agree to our{" "}
                            <Link href="/terms" className="text-[#FF8C00] underline">Terms</Link> &{" "}
                            <Link href="/privacy-policy" className="text-[#FF8C00] underline">Privacy Policy</Link>
                        </p>
                    </div>
                )}

                {/* ── STEP 2: OTP Input ── */}
                {step === "otp" && (
                    <div className="w-full max-w-sm space-y-6">
                        <div className="text-center">
                            <h2 className="text-lg font-semibold text-gray-900">Verify OTP</h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Sent to <span className="font-medium text-gray-700">+91 {phone}</span>
                            </p>
                        </div>

                        {/* Development OTP Banner */}
                        {devOtp && (
                            <div className="mx-auto w-full rounded-lg border border-[#00B894]/30 bg-[#E5FBF9] p-3 text-center transition-all animate-in fade-in slide-in-from-bottom-2">
                                <p className="text-xs font-semibold text-[#00B894] uppercase tracking-wider mb-1">
                                    Simulated OTP (Development)
                                </p>
                                <p className="text-2xl font-mono font-bold text-[#1A1A1A] tracking-[0.2em]">{devOtp}</p>
                            </div>
                        )}

                        <div className="flex justify-center gap-2.5">
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={(el) => { otpRefs.current[i] = el; }}
                                    type="tel"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => {
                                        if (error) setError("");
                                        handleOtpChange(i, e.target.value);
                                    }}
                                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                    className="size-12 rounded-xl border-2 border-gray-200 bg-white text-center text-xl font-bold text-gray-900 shadow-sm transition-all focus:border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-orange-200"
                                />
                            ))}
                        </div>

                        {error && <p className="text-center text-sm font-medium text-red-500 bg-red-50/50 py-2 rounded-lg">{error}</p>}

                        <Button
                            onClick={() => verifyOtp()}
                            disabled={loading || otp.join("").length !== 6}
                            className="h-13 w-full rounded-xl bg-gradient-to-r from-[#FF8C00] to-[#E67E00] text-base font-semibold"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Verify & Login"}
                        </Button>

                        <div className="text-center">
                            {countdown > 0 ? (
                                <p className="text-sm font-medium text-gray-400 bg-gray-50 inline-block px-3 py-1 rounded-full">Resend in {countdown}s</p>
                            ) : (
                                <button
                                    onClick={sendOtp}
                                    disabled={loading}
                                    className="text-sm font-semibold text-[#FF8C00] hover:text-[#E67E00] disabled:opacity-50 transition-colors"
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
                            <h2 className="text-lg font-semibold text-gray-900">Welcome! 🙏</h2>
                            <p className="mt-1 text-sm text-gray-500">Tell us about yourself</p>
                        </div>

                        <div className="space-y-3">
                            <div className="relative">
                                <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (error) setError("");
                                    }}
                                    onKeyDown={(e) => e.key === "Enter" && saveProfile()}
                                    placeholder="Enter your name"
                                    className="h-14 rounded-xl text-lg pl-10 bg-white"
                                    autoFocus
                                />
                            </div>

                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email (optional)"
                                    className="h-14 rounded-xl text-lg pl-10 bg-white"
                                />
                            </div>
                        </div>

                        {error && <p className="text-center text-sm font-medium text-red-500 bg-red-50/50 py-2 rounded-lg">{error}</p>}

                        <Button
                            onClick={saveProfile}
                            disabled={loading || !name.trim()}
                            className="h-13 w-full rounded-xl bg-gradient-to-r from-[#FF8C00] to-[#E67E00] text-base font-semibold"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Get Started →"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function UserLoginPage() {
    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
            <LoginContent />
        </GoogleOAuthProvider>
    );
}
