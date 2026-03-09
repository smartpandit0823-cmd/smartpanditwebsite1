"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, ShieldCheck, Loader2, CheckCircle } from "lucide-react";

const SERVICES = [
  "Puja Booking",
  "Astrology Consultation",
  "Temple Darshan",
  "Store Product",
  "Kumbh Package",
  "Other",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.service || !form.message.trim()) {
      setError("Please fill all required fields.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit. Please try again.");
        return;
      }

      setSuccess(true);
      setForm({ name: "", phone: "", email: "", service: "", message: "", city: "" });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-8 md:pt-12">
      <div className="text-center md:text-left">
        <h1 className="font-heading text-3xl font-bold text-warm-900 md:text-4xl">
          Contact SanatanSetu
        </h1>
        <p className="mt-2 text-sm text-warm-600 md:text-base">
          Need help with booking, spiritual products, or services? Our team is here for you.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_1fr]">
        <section className="space-y-4">
          <a
            href="mailto:support@sanatansetu.in"
            className="card-surface flex items-center gap-3 rounded-2xl border border-saffron-200/70 bg-white/85 p-4"
          >
            <div className="flex size-11 items-center justify-center rounded-full bg-saffron-100 text-saffron-700">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-warm-600">Email</p>
              <p className="font-semibold text-warm-900">support@sanatansetu.in</p>
            </div>
          </a>
          <a
            href="tel:+919022462127"
            className="card-surface flex items-center gap-3 rounded-2xl border border-saffron-200/70 bg-white/85 p-4"
          >
            <div className="flex size-11 items-center justify-center rounded-full bg-saffron-100 text-saffron-700">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-warm-600">Phone / WhatsApp</p>
              <p className="font-semibold text-warm-900">+91 90224 62127</p>
            </div>
          </a>
          <div className="card-surface flex items-center gap-3 rounded-2xl border border-saffron-200/70 bg-white/85 p-4">
            <div className="flex size-11 items-center justify-center rounded-full bg-saffron-100 text-saffron-700">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-warm-600">Service Region</p>
              <p className="font-semibold text-warm-900">Pan India (50+ cities)</p>
            </div>
          </div>
          <div className="rounded-2xl border border-gold-200/70 bg-gradient-to-r from-gold-50 to-saffron-50 p-4">
            <p className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-amber-800">
              <ShieldCheck size={13} />
              Trust Center
            </p>
            <p className="mt-2 text-sm text-warm-700">
              Verified pandits, secure transactions, and transparent pricing. Your spiritual journey is in safe hands.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-saffron-200/70 bg-white/85 p-5">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle size={48} className="text-green-500 mb-4" />
              <h2 className="font-heading text-xl font-semibold text-warm-900">
                Enquiry Submitted!
              </h2>
              <p className="mt-2 text-sm text-warm-600 max-w-xs">
                Our team will contact you within 24 hours. Thank you for reaching out!
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-6 text-sm font-semibold text-saffron-600 hover:text-saffron-700"
              >
                Submit Another Enquiry
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-heading text-xl font-semibold text-warm-900">
                Quick Enquiry Form
              </h2>
              <p className="mt-1 text-sm text-warm-600">
                Fill your details and our team contacts you shortly.
              </p>
              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name *"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-saffron-200 px-4 py-3 text-sm outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 transition-all"
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number *"
                  maxLength={10}
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-saffron-200 px-4 py-3 text-sm outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 transition-all"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email (optional)"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-saffron-200 px-4 py-3 text-sm outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 transition-all"
                />
                <input
                  name="city"
                  type="text"
                  placeholder="City (optional)"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-saffron-200 px-4 py-3 text-sm outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 transition-all"
                />
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-saffron-200 px-4 py-3 text-sm outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 transition-all"
                >
                  <option value="">Service Interested In *</option>
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Your Message *"
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-saffron-200 px-4 py-3 text-sm outline-none focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 transition-all resize-none"
                />

                {error && (
                  <p className="text-center text-sm font-medium text-red-500 bg-red-50/50 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="gradient-saffron w-full rounded-xl px-5 py-3 text-sm font-semibold text-white disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Enquiry"
                  )}
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
