"use client";

import { useEffect, useState, useCallback } from "react";
import { MessageSquare, Phone, Mail, Clock, Trash2, ChevronDown } from "lucide-react";

interface Inquiry {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  message: string;
  city?: string;
  status: "new" | "contacted" | "resolved" | "closed";
  adminNote?: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-500",
};

const STATUS_OPTIONS = ["all", "new", "contacted", "resolved", "closed"];

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/inquiries?status=${statusFilter}&page=${page}&limit=20`
      );
      const data = await res.json();
      setInquiries(data.inquiries || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchInquiries();
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
    fetchInquiries();
  };

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
          <p className="text-sm text-gray-500 mt-1">
            {total} total enquir{total === 1 ? "y" : "ies"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                statusFilter === s
                  ? "bg-saffron-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-saffron-200 border-t-saffron-500" />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MessageSquare size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">No enquiries found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div
              key={inq._id}
              className="rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{inq.name}</h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                        STATUS_COLORS[inq.status]
                      }`}
                    >
                      {inq.status}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-saffron-50 px-2.5 py-0.5 text-[11px] font-medium text-saffron-700">
                      {inq.service}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Phone size={14} />
                      <a href={`tel:+91${inq.phone}`} className="hover:text-saffron-600">
                        {inq.phone}
                      </a>
                    </span>
                    {inq.email && (
                      <span className="inline-flex items-center gap-1">
                        <Mail size={14} />
                        {inq.email}
                      </span>
                    )}
                    {inq.city && <span>{inq.city}</span>}
                    <span className="inline-flex items-center gap-1">
                      <Clock size={14} />
                      {formatDate(inq.createdAt)}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                    {inq.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="relative">
                    <select
                      value={inq.status}
                      onChange={(e) => updateStatus(inq._id, e.target.value)}
                      className="appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 pr-8 text-xs font-medium text-gray-700 cursor-pointer hover:border-gray-300"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  <button
                    onClick={() => deleteInquiry(inq._id)}
                    className="rounded-lg p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
