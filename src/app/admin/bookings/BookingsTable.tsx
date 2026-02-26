"use client";

import Link from "next/link";
import { AdminTable, StatusBadge } from "@/components/admin/AdminTable";
import { formatCurrency, formatDate } from "@/lib/utils/index";
import { generateWhatsAppLink, bookingWhatsAppMessage } from "@/lib/whatsapp";
import { MessageCircle, Phone } from "lucide-react";
import type { AdminColumn, AdminFilter } from "@/components/admin/AdminTable";

interface BookingRow {
  _id: string;
  bookingId?: string;
  userId: { phone: string; name?: string } | null;
  pujaId: { name: string; slug: string } | null;
  package: string;
  date: string;
  time: string;
  address: string;
  status: string;
  paymentStatus: string;
  paymentType?: string;
  amount: number;
  amountPaid?: number;
  advanceAmount?: number;
  assignedPanditId?: { name: string; phone: string } | null;
}

const columns: AdminColumn<BookingRow>[] = [
  {
    key: "bookingId",
    label: "ID",
    render: (row) => <span className="text-xs font-mono font-bold text-saffron-700">{row.bookingId || row._id.slice(-6)}</span>,
  },
  {
    key: "userId",
    label: "User",
    render: (row) => (
      <div>
        <p className="font-medium">{row.userId?.name || "—"}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-gray-500">{row.userId?.phone}</p>
          {row.userId?.phone && (
            <>
              <a href={`tel:${row.userId.phone}`} className="text-blue-500 hover:text-blue-700" title="Call User">
                <Phone size={12} />
              </a>
              <a
                href={`https://wa.me/91${row.userId.phone.replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(`Hari Om ${row.userId.name || "Ji"},\n\nWe received your booking request for ${row.pujaId?.name || "Puja"}. Our team will contact you shortly to confirm the details.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#25D366] hover:text-[#1ead51]"
                title="WhatsApp User"
              >
                <MessageCircle size={12} />
              </a>
            </>
          )}
        </div>
      </div>
    ),
  },
  {
    key: "pujaId",
    label: "Puja",
    render: (row) => <span className="font-medium text-saffron-700">{row.pujaId?.name || "—"}</span>,
  },
  { key: "package", label: "Package" },
  {
    key: "date",
    label: "Date & Time",
    render: (row) => (
      <div>
        <p className="text-sm">{formatDate(row.date)}</p>
        <p className="text-xs text-gray-500">{row.time}</p>
      </div>
    ),
  },
  {
    key: "amount",
    label: "Amount",
    render: (row) => (
      <div>
        <span className="font-semibold">{formatCurrency(row.amount)}</span>
        {row.paymentType && (
          <span className={`ml-1 inline-block rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ${row.paymentType === "full" && row.paymentStatus === "paid" ? "bg-green-100 text-green-700"
              : row.paymentType === "advance" && row.paymentStatus === "partial" ? "bg-orange-100 text-orange-700"
                : "bg-gray-100 text-gray-600"
            }`}>
            {row.paymentType === "advance" ? "ADV" : "FULL"}
          </span>
        )}
        {row.amountPaid !== undefined && row.amountPaid > 0 && row.amountPaid < row.amount && (
          <p className="text-[10px] text-orange-600 mt-0.5">Paid: {formatCurrency(row.amountPaid)} / Rem: {formatCurrency(row.amount - row.amountPaid)}</p>
        )}
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: "paymentStatus",
    label: "Payment",
    render: (row) => <StatusBadge status={row.paymentStatus} />,
  },
  {
    key: "assignedPanditId",
    label: "Pandit",
    render: (row) => row.assignedPanditId?.name || <span className="text-gray-400">Not assigned</span>,
  },
];

const filters: AdminFilter[] = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "requested", label: "Requested" },
      { value: "price_finalized", label: "Price Finalized" },
      { value: "payment_pending", label: "Payment Pending" },
      { value: "confirmed", label: "Confirmed" },
      { value: "assigned", label: "Assigned" },
      { value: "inprogress", label: "In Progress" },
      { value: "completed", label: "Completed" },
      { value: "submitted", label: "Submitted" },
      { value: "cancelled", label: "Cancelled" },
    ],
  },
  {
    key: "paymentStatus",
    label: "Payment",
    options: [
      { value: "pending", label: "Pending" },
      { value: "paid", label: "Paid" },
      { value: "refunded", label: "Refunded" },
    ],
  },
];

export function BookingsTableV2({
  data,
  total,
  page,
  pandits,
}: {
  data: BookingRow[];
  total: number;
  page: number;
  pandits: { _id: string; name: string; phone: string }[];
}) {
  // For WhatsApp: find first available pandit to send booking to
  function getWhatsAppLink(row: BookingRow): string | null {
    // If already assigned, link to assigned pandit
    if (row.assignedPanditId?.phone) {
      return generateWhatsAppLink(
        row.assignedPanditId.phone,
        bookingWhatsAppMessage({
          panditName: row.assignedPanditId.name,
          userName: row.userId?.name || "Customer",
          userPhone: row.userId?.phone || "",
          pujaName: row.pujaId?.name || "Puja",
          packageName: row.package,
          date: formatDate(row.date),
          time: row.time,
          address: row.address || "",
          amount: row.amount,
        })
      );
    }
    // If not assigned and there are pandits, show first pandit
    if (pandits.length > 0) {
      const p = pandits[0];
      return generateWhatsAppLink(
        p.phone,
        bookingWhatsAppMessage({
          panditName: p.name,
          userName: row.userId?.name || "Customer",
          userPhone: row.userId?.phone || "",
          pujaName: row.pujaId?.name || "Puja",
          packageName: row.package,
          date: formatDate(row.date),
          time: row.time,
          address: row.address || "",
          amount: row.amount,
        })
      );
    }
    return null;
  }

  return (
    <AdminTable
      data={data}
      columns={columns}
      total={total}
      page={page}
      filters={filters}
      searchPlaceholder="Search by user name or phone..."
      emptyMessage="No bookings found"
      exportFilename="bookings"
      whatsappAction={getWhatsAppLink}
      actions={[
        {
          label: "View",
          href: (row) => `/admin/bookings/${row._id}`,
        },
      ]}
    />
  );
}
