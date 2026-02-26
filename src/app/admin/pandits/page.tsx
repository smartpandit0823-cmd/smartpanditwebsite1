"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  CheckCircle2, XCircle, MapPin, Phone, Mail, Star, Clock,
  Users, Shield, Filter, Map, List, Eye, Loader2, MessageCircle
} from "lucide-react";
import { PanditMap } from "@/components/admin/PanditMap";

interface PanditData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  city: string;
  state: string;
  address?: string;
  pincode?: string;
  lat?: number;
  lng?: number;
  experience: number;
  specializations: string[];
  providesAstrology: boolean;
  certifications: string[];
  verificationStatus: "pending" | "verified" | "rejected";
  status: string;
  totalPujasCompleted: number;
  totalAstrologyCompleted: number;
  averageRating: number;
  createdAt: string;
}

type TabType = "all" | "pending" | "verified" | "rejected";

export default function AdminPanditsPage() {
  const [pandits, setPandits] = useState<PanditData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPandits = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/pandits");
      const json = await res.json();
      if (json.success) setPandits(json.data || json.pandits || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPandits();
  }, [fetchPandits]);

  async function updatePanditStatus(id: string, verificationStatus: string) {
    setActionLoading(id);
    try {
      await fetch(`/api/admin/pandits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationStatus }),
      });
      fetchPandits();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  }

  const filtered = activeTab === "all"
    ? pandits
    : pandits.filter(p => p.verificationStatus === activeTab);

  const pendingCount = pandits.filter(p => p.verificationStatus === "pending").length;
  const verifiedCount = pandits.filter(p => p.verificationStatus === "verified").length;
  const rejectedCount = pandits.filter(p => p.verificationStatus === "rejected").length;

  // Group pandits by city for map stats
  const cityStats: Record<string, { total: number; pandits: number; astrologers: number }> = {};
  pandits.filter(p => p.verificationStatus === "verified").forEach(p => {
    const key = `${p.city}, ${p.state}`;
    if (!cityStats[key]) cityStats[key] = { total: 0, pandits: 0, astrologers: 0 };
    cityStats[key].total++;
    if (p.providesAstrology) cityStats[key].astrologers++;
    else cityStats[key].pandits++;
  });

  const tabs: { id: TabType; label: string; count: number; color: string }[] = [
    { id: "all", label: "All", count: pandits.length, color: "text-warm-700" },
    { id: "pending", label: "Pending", count: pendingCount, color: "text-yellow-600" },
    { id: "verified", label: "Verified", count: verifiedCount, color: "text-green-600" },
    { id: "rejected", label: "Rejected", count: rejectedCount, color: "text-red-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-warm-900">Pandits & Astrologers</h1>
          <p className="mt-1 text-warm-600">Manage pandit profiles, approve applications, view location map</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition ${viewMode === "list" ? "bg-saffron-100 text-saffron-700" : "text-warm-500 hover:bg-warm-100"}`}
          >
            <List size={16} /> List
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition ${viewMode === "map" ? "bg-saffron-100 text-saffron-700" : "text-warm-500 hover:bg-warm-100"}`}
          >
            <Map size={16} /> Area Map
          </button>
          <Link
            href="/admin/pandits/new"
            className="flex items-center gap-1.5 rounded-lg bg-saffron-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-saffron-600"
          >
            + Add Pandit
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<Users size={20} />} value={pandits.length} label="Total Pandits" color="bg-blue-50 text-blue-600" />
        <StatCard icon={<Clock size={20} />} value={pendingCount} label="Pending Approval" color="bg-yellow-50 text-yellow-600" />
        <StatCard icon={<Shield size={20} />} value={verifiedCount} label="Verified" color="bg-green-50 text-green-600" />
        <StatCard icon={<Star size={20} />} value={pandits.filter(p => p.providesAstrology).length} label="Astrologers" color="bg-purple-50 text-purple-600" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-warm-200 bg-white p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${activeTab === tab.id ? "bg-saffron-100 text-saffron-700 shadow-sm" : "text-warm-500 hover:bg-warm-50"
              }`}
          >
            {tab.label}
            <span className={`ml-1.5 text-xs ${tab.color}`}>({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-saffron-500" size={32} />
        </div>
      ) : viewMode === "map" ? (
        /* ── Area Map View ── */
        <div className="rounded-2xl border border-warm-200 bg-white p-6">
          <h3 className="mb-4 font-heading text-lg font-bold text-warm-900">📍 Pandit Distribution by Area</h3>
          {Object.keys(cityStats).length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(cityStats)
                .sort(([, a], [, b]) => b.total - a.total)
                .map(([city, stats]) => (
                  <div key={city} className="flex items-center justify-between rounded-xl border border-warm-100 bg-warm-50/50 p-4 transition hover:bg-warm-50">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-saffron-100 text-saffron-600">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-warm-900">{city}</p>
                        <p className="text-xs text-warm-500">
                          {stats.pandits} Pandit{stats.pandits !== 1 ? "s" : ""}
                          {stats.astrologers > 0 && ` · ${stats.astrologers} Astrologer${stats.astrologers !== 1 ? "s" : ""}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex size-9 items-center justify-center rounded-full bg-saffron-500 text-sm font-bold text-white">
                      {stats.total}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="py-10 text-center text-warm-500">No verified pandits yet.</p>
          )}

          {/* Google Maps for pandit locations */}
          {pandits.some(p => p.lat && p.lng && p.verificationStatus === "verified") && (
            <div className="mt-6">
              <h4 className="mb-3 text-sm font-bold text-warm-700">Pandit Locations on Map</h4>
              <div className="overflow-hidden rounded-xl border border-warm-200">
                <PanditMap pandits={pandits.filter(p => p.verificationStatus === "verified")} />
              </div>
              <p className="mt-2 text-xs text-warm-400">
                Data shown on a real map API component. API key must be active in .env.local to avoid watermark.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* ── List View ── */
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-warm-200 bg-white py-16 text-center text-warm-500">
              <Users size={48} className="mx-auto mb-4 text-warm-300" />
              <p className="text-lg font-medium">No pandits in this category</p>
            </div>
          ) : (
            filtered.map(pandit => (
              <div
                key={pandit._id}
                className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${pandit.verificationStatus === "pending" ? "border-yellow-200 bg-yellow-50/30" :
                  pandit.verificationStatus === "rejected" ? "border-red-100 bg-red-50/20" :
                    "border-warm-200"
                  }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left: Info */}
                  <div className="flex items-start gap-4">
                    <div className="flex size-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-saffron-50">
                      {pandit.photo ? (
                        <img src={pandit.photo} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-saffron-500">{pandit.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-warm-900">{pandit.name}</h3>
                        {pandit.providesAstrology && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                            <Star size={10} /> Astrologer
                          </span>
                        )}
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${pandit.verificationStatus === "verified" ? "bg-green-50 text-green-700" :
                          pandit.verificationStatus === "pending" ? "bg-yellow-50 text-yellow-700" :
                            "bg-red-50 text-red-700"
                          }`}>
                          {pandit.verificationStatus}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-warm-500">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {pandit.city}, {pandit.state}</span>
                        <span className="flex items-center gap-1"><Phone size={12} /> {pandit.phone}</span>
                        <span className="flex items-center gap-1"><Mail size={12} /> {pandit.email}</span>
                      </div>
                      {pandit.experience > 0 && (
                        <p className="mt-1 text-xs text-warm-600">{pandit.experience} yrs experience</p>
                      )}
                      {pandit.specializations?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {pandit.specializations.slice(0, 4).map((s, i) => (
                            <span key={i} className="rounded-full bg-warm-50 px-2 py-0.5 text-[10px] font-medium text-warm-600 border border-warm-100">{s}</span>
                          ))}
                          {pandit.specializations.length > 4 && (
                            <span className="text-[10px] text-warm-400">+{pandit.specializations.length - 4} more</span>
                          )}
                        </div>
                      )}
                      {pandit.certifications?.length > 0 && (
                        <p className="mt-1 text-[10px] text-warm-500">📄 {pandit.certifications.length} certification(s) uploaded</p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-shrink-0 items-center gap-2">
                    {pandit.verificationStatus === "pending" && (
                      <>
                        <button
                          onClick={() => updatePanditStatus(pandit._id, "verified")}
                          disabled={actionLoading === pandit._id}
                          className="flex items-center gap-1.5 rounded-lg bg-green-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-green-600 disabled:opacity-50"
                        >
                          {actionLoading === pandit._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                          Approve
                        </button>
                        <button
                          onClick={() => updatePanditStatus(pandit._id, "rejected")}
                          disabled={actionLoading === pandit._id}
                          className="flex items-center gap-1.5 rounded-lg bg-red-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-600 disabled:opacity-50"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </>
                    )}
                    {pandit.verificationStatus === "rejected" && (
                      <button
                        onClick={() => updatePanditStatus(pandit._id, "verified")}
                        disabled={actionLoading === pandit._id}
                        className="flex items-center gap-1.5 rounded-lg bg-green-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-green-600 disabled:opacity-50"
                      >
                        <CheckCircle2 size={14} /> Re-approve
                      </button>
                    )}
                    {pandit.verificationStatus === "verified" && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                        <Shield size={14} /> Verified
                      </span>
                    )}
                    <Link
                      href={`/admin/pandits/${pandit._id}`}
                      className="flex items-center gap-1 rounded-lg border border-warm-200 px-3 py-2 text-xs font-semibold text-warm-600 transition hover:bg-warm-50"
                    >
                      <Eye size={14} /> View
                    </Link>
                    <a
                      href={`https://wa.me/91${pandit.phone?.replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(`Hari Om ${pandit.name} Ji,`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-[#25D366]/10 px-3 py-2 text-xs font-semibold text-[#25D366] transition hover:bg-[#25D366]/20 border border-[#25D366]/30"
                      title="WhatsApp"
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                    <a
                      href={`tel:${pandit.phone}`}
                      className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100 border border-blue-200"
                      title="Call"
                    >
                      <Phone size={14} /> Call
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, value, label, color }: { icon: React.ReactNode; value: number; label: string; color: string }) {
  return (
    <div className="rounded-2xl border border-warm-200 bg-white p-5 transition hover:shadow-sm">
      <div className={`mb-3 inline-flex size-10 items-center justify-center rounded-xl ${color}`}>
        {icon}
      </div>
      <p className="text-2xl font-black text-warm-900">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-warm-500">{label}</p>
    </div>
  );
}
