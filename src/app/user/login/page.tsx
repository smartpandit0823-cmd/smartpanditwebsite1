"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Smartphone, Loader2, Mail, User as UserIcon, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import {
    authClient,
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from "@/lib/firebase/client";
import type { ConfirmationResult } from "@/lib/firebase/client";

type Step = "phone" | "otp" | "name";

const MAX_OTP_SENDS = 3;
const COOLDOWNS = [30, 60, 120];

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
    const [sendCount, setSendCount] = useState(0);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    const confirmationResultRef = useRef<ConfirmationResult | null>(null);
    const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
    const recaptchaContainerIdRef = useRef(0);
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            destroyRecaptcha();
        };
    }, []);

    useEffect(() => {
        if (countdown <= 0) return;
        const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [countdown]);

    useEffect(() => {
        if (step === "otp") otpRefs.current[0]?.focus();
    }, [step]);

    function destroyRecaptcha() {
        if (recaptchaVerifierRef.current) {
            try { recaptchaVerifierRef.current.clear(); } catch { /* already cleared */ }
            recaptchaVerifierRef.current = null;
        }
        const old = document.getElementById("recaptcha-box");
        if (old) old.innerHTML = "";
    }

    const setupRecaptcha = useCallback((): RecaptchaVerifier => {
        destroyRecaptcha();

        const wrapper = document.getElementById("recaptcha-box");
        if (wrapper) wrapper.innerHTML = "";

        recaptchaContainerIdRef.current += 1;
        const id = `recaptcha-widget-${recaptchaContainerIdRef.current}`;
        const div = document.createElement("div");
        div.id = id;
        document.getElementById("recaptcha-box")?.appendChild(div);

        const verifier = new RecaptchaVerifier(authClient, id, {
            size: "invisible",
            callback: () => { /* solved */ },
            "expired-callback": () => {
                if (!isMountedRef.current) return;
                setError("reCAPTCHA expired. Please try again.");
                destroyRecaptcha();
            },
        });

        recaptchaVerifierRef.current = verifier;
        return verifier;
    }, []);

    const sendOtp = async () => {
        if (phone.length < 10) {
            setError("Enter a valid 10-digit phone number");
            return;
        }

        if (sendCount >= MAX_OTP_SENDS) {
            setError("Maximum OTP attempts reached. Please try again after some time.");
            return;
        }

        if (countdown > 0) {
            setError(`Please wait ${countdown}s before requesting again`);
            return;
        }

        setError("");
        setLoading(true);

        try {
            const verifier = setupRecaptcha();
            await verifier.render();

            const phoneNumber = `+91${phone}`;
            const result = await signInWithPhoneNumber(authClient, phoneNumber, verifier);
            confirmationResultRef.current = result;

            const newSendCount = sendCount + 1;
            setSendCount(newSendCount);

            setOtp(["", "", "", "", "", ""]);
            const cooldown = COOLDOWNS[Math.min(newSendCount - 1, COOLDOWNS.length - 1)];
            setCountdown(cooldown);
            setStep("otp");
        } catch (err: unknown) {
            console.error("Firebase sendOtp error:", err);
            destroyRecaptcha();

            const firebaseError = err as { code?: string; message?: string };
            if (firebaseError.code === "auth/too-many-requests") {
                setError("Too many attempts. Please try again after 15 minutes.");
            } else if (firebaseError.code === "auth/invalid-phone-number") {
                setError("Invalid phone number. Please check and try again.");
            } else if (firebaseError.code === "auth/captcha-check-failed") {
                setError("Verification failed. Please refresh the page and try again.");
            } else if (firebaseError.code === "auth/network-request-failed") {
                setError("Network error. Check your connection and try again.");
            } else {
                setError(firebaseError.message || "Failed to send OTP. Please try again.");
            }
        } finally {
            if (isMountedRef.current) setLoading(false);
        }
    };

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

    function handleOtpPaste(e: React.ClipboardEvent) {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 0) return;

        const newOtp = [...otp];
        for (let i = 0; i < 6; i++) {
            newOtp[i] = pasted[i] || "";
        }
        setOtp(newOtp);

        const focusIdx = Math.min(pasted.length, 5);
        otpRefs.current[focusIdx]?.focus();

        if (pasted.length === 6) {
            verifyOtp(pasted);
        }
    }

    async function verifyOtp(otpCode?: string) {
        const code = otpCode || otp.join("");
        if (code.length !== 6) {
            setError("Enter the 6-digit OTP");
            return;
        }

        if (!confirmationResultRef.current) {
            setError("Session expired. Please resend OTP.");
            setStep("phone");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const userCredential = await confirmationResultRef.current.confirm(code);
            const idToken = await userCredential.user.getIdToken();

            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: idToken }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Verification failed. Try again.");
                setLoading(false);
                return;
            }

            destroyRecaptcha();
            await refresh();

            if (!data.user?.name) {
                setStep("name");
                setLoading(false);
                return;
            }

            router.push("/");
            router.refresh();
        } catch (err: unknown) {
            console.error("Firebase verifyOtp error:", err);
            const firebaseError = err as { code?: string };
            if (firebaseError.code === "auth/invalid-verification-code") {
                setError("Invalid OTP. Please check and try again.");
            } else if (firebaseError.code === "auth/code-expired") {
                setError("OTP expired. Please resend.");
            } else {
                setError("Verification failed. Try again.");
            }
            setOtp(["", "", "", "", "", ""]);
            otpRefs.current[0]?.focus();
        } finally {
            if (isMountedRef.current) setLoading(false);
        }
    }

    const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
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
                setName(data.googleData.name);
                setEmail(data.googleData.email);
                setStep("phone");
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

    async function saveProfile() {
        if (!name.trim()) {
            setError("Please enter your name");
            return;
        }
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim(), email: email.trim() || undefined }),
            });

            if (!res.ok) {
                setError("Failed to save profile. Try again.");
                setLoading(false);
                return;
            }

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
            confirmationResultRef.current = null;
        } else if (step === "name") {
            router.push("/");
        } else {
            router.back();
        }
    };

    const remainingSends = MAX_OTP_SENDS - sendCount;

    return (
        <div className="flex min-h-dvh flex-col bg-gradient-to-b from-[#fffdf7] to-orange-50/30">
            <div id="recaptcha-box" className="hidden" />

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
                                onKeyDown={(e) => e.key === "Enter" && phone.length === 10 && sendOtp()}
                                placeholder="Enter 10-digit number"
                                className="h-14 rounded-xl pl-20 text-lg tracking-wider bg-white"
                                autoFocus
                            />
                        </div>

                        {error && <p className="text-center text-sm font-medium text-red-500 bg-red-50/50 py-2 rounded-lg">{error}</p>}

                        <Button
                            onClick={sendOtp}
                            disabled={loading || phone.length !== 10 || sendCount >= MAX_OTP_SENDS}
                            className="h-13 w-full rounded-xl bg-gradient-to-r from-[#FF8C00] to-[#E67E00] text-base font-semibold shadow-lg shadow-orange-200/50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Continue"}
                        </Button>

                        {sendCount > 0 && sendCount < MAX_OTP_SENDS && (
                            <p className="text-center text-xs text-gray-400">
                                {remainingSends} OTP request{remainingSends !== 1 ? "s" : ""} remaining
                            </p>
                        )}

                        <div className="relative my-6 flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <span className="relative bg-[#fffdf7] px-4 text-xs font-semibold uppercase text-gray-400">
                                OR
                            </span>
                        </div>

                        <div className="w-full flex justify-center">
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
                                Sent to <span className="font-medium text-gray-700">+91 {phone.slice(0, 5)} {phone.slice(5)}</span>
                            </p>
                        </div>

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
                                    onPaste={i === 0 ? handleOtpPaste : undefined}
                                    className="size-12 rounded-xl border-2 border-gray-200 bg-white text-center text-xl font-bold text-gray-900 shadow-sm transition-all focus:border-[#FF8C00] focus:outline-none focus:ring-2 focus:ring-orange-200"
                                    disabled={loading}
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

                        <div className="text-center space-y-2">
                            {countdown > 0 ? (
                                <p className="text-sm font-medium text-gray-400 bg-gray-50 inline-block px-3 py-1 rounded-full">
                                    Resend in {countdown}s
                                </p>
                            ) : sendCount < MAX_OTP_SENDS ? (
                                <button
                                    onClick={sendOtp}
                                    disabled={loading}
                                    className="text-sm font-semibold text-[#FF8C00] hover:text-[#E67E00] disabled:opacity-50 transition-colors"
                                >
                                    Resend OTP
                                </button>
                            ) : (
                                <p className="text-sm text-red-500 font-medium bg-red-50 inline-block px-3 py-1 rounded-full">
                                    Max resends reached
                                </p>
                            )}

                            {sendCount > 0 && sendCount < MAX_OTP_SENDS && (
                                <p className="text-xs text-gray-400">
                                    {remainingSends} resend{remainingSends !== 1 ? "s" : ""} left
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-2">
                            <ShieldCheck size={12} />
                            <span>OTP is verified securely via Firebase</span>
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
