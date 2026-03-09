"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] relative overflow-hidden items-center justify-center">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />

        {/* Glowing orbs */}
        <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-saffron-500/20 blur-[100px]" />
        <div className="absolute bottom-32 right-16 h-56 w-56 rounded-full bg-violet-500/15 blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px]" />

        <div className="relative z-10 text-center px-12 max-w-lg">
          {/* Om Symbol */}
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-saffron-500 to-amber-600 text-5xl font-bold text-white shadow-2xl shadow-saffron-500/30 animate-breathe">
            ॐ
          </div>

          <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            SmartPandit
          </h1>
          <p className="text-lg text-gray-400 mb-3">
            Enterprise Admin Portal
          </p>
          <div className="h-0.5 w-16 mx-auto bg-gradient-to-r from-transparent via-saffron-500 to-transparent mb-6" />
          <p className="text-sm text-gray-500 leading-relaxed">
            Manage your spiritual commerce platform with advanced analytics, real-time insights, and enterprise-grade tools.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              { label: "Products", icon: "📦" },
              { label: "Orders", icon: "🛒" },
              { label: "Analytics", icon: "📊" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-2xl mb-1">{item.icon}</div>
                <p className="text-xs text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-white px-6">
        <div className="w-full max-w-[400px]">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-saffron-500 to-amber-600 text-3xl font-bold text-white shadow-lg">
              ॐ
            </div>
            <h1 className="text-2xl font-bold text-gray-900">SmartPandit</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to your admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3.5 text-sm text-red-700 animate-scale-in">
                <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <span className="text-xs">!</span>
                </div>
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@smartpandit.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="pl-10 h-12 rounded-xl border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:border-saffron-400 focus:ring-saffron-200 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pl-10 pr-10 h-12 rounded-xl border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:border-saffron-400 focus:ring-saffron-200 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-sm font-semibold shadow-lg shadow-gray-900/20 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign in to Dashboard"
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            SmartPandit Enterprise © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <LoginPageContent />
    </Suspense>
  );
}
