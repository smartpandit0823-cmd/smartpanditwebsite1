"use client";

import { AdminTable, StatusBadge } from "@/components/admin/AdminTable";
import { formatCurrency, formatDate } from "@/lib/utils/index";
import { generateWhatsAppLink, astrologyWhatsAppMessage } from "@/lib/whatsapp";
import type { AdminColumn, AdminFilter } from "@/components/admin/AdminTable";

interface AstrologyRow {
    _id: string;
    name: string;
    phone: string;
    email: string;
    birthDate: string;
    birthTime?: string;
    birthPlace: string;
    problemCategory: string;
    sessionType: number;
    preferredDate?: string;
    preferredTime?: string;
    priority: string;
    status: string;
    paymentStatus: string;
    amount: number;
    assignedAstrologerId?: { _id: string; name: string; phone: string } | null;
    finalCallTime?: string;
    adminNotes?: string;
    createdAt: string;
}

const columns: AdminColumn<AstrologyRow>[] = [
    {
        key: "name",
        label: "Client",
        render: (row) => (
            <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-xs text-gray-500">{row.phone}</p>
            </div>
        ),
    },
    {
        key: "birthDate",
        label: "Birth Details",
        render: (row) => (
            <div className="text-sm">
                <p>{formatDate(row.birthDate)}</p>
                <p className="text-xs text-gray-500">
                    {row.birthTime || "—"} | {row.birthPlace}
                </p>
            </div>
        ),
    },
    { key: "problemCategory", label: "Problem" },
    {
        key: "sessionType",
        label: "Session",
        render: (row) => <span>{row.sessionType} min</span>,
    },
    {
        key: "priority",
        label: "Priority",
        render: (row) => <StatusBadge status={row.priority} />,
    },
    {
        key: "amount",
        label: "Amount",
        render: (row) => <span className="font-semibold">{formatCurrency(row.amount)}</span>,
    },
    {
        key: "paymentStatus",
        label: "Payment",
        render: (row) => <StatusBadge status={row.paymentStatus} />,
    },
    {
        key: "status",
        label: "Status",
        render: (row) => <StatusBadge status={row.status} />,
    },
    {
        key: "assignedAstrologerId",
        label: "Astrologer",
        render: (row) => row.assignedAstrologerId?.name || <span className="text-gray-400">Not assigned</span>,
    },
    {
        key: "finalCallTime",
        label: "Call Time",
        render: (row) =>
            row.finalCallTime ? (
                <span className="text-sm font-medium text-purple-600">{formatDate(row.finalCallTime)}</span>
            ) : (
                <span className="text-gray-400">—</span>
            ),
    },
];

const filters: AdminFilter[] = [
    {
        key: "status",
        label: "Status",
        options: [
            { value: "requested", label: "Requested" },
            { value: "assigned", label: "Assigned" },
            { value: "confirmed", label: "Confirmed" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
        ],
    },
    {
        key: "priority",
        label: "Priority",
        options: [
            { value: "normal", label: "Normal" },
            { value: "urgent", label: "Urgent" },
            { value: "vip", label: "VIP" },
        ],
    },
];

export function AstrologyTable({
    data,
    total,
    page,
    astrologers,
}: {
    data: AstrologyRow[];
    total: number;
    page: number;
    astrologers: { _id: string; name: string; phone: string }[];
}) {
    function getWhatsAppLink(row: AstrologyRow): string | null {
        // If assigned, contact assigned astrologer
        if (row.assignedAstrologerId?.phone) {
            return generateWhatsAppLink(
                row.assignedAstrologerId.phone,
                astrologyWhatsAppMessage({
                    astrologerName: row.assignedAstrologerId.name,
                    userName: row.name,
                    userPhone: row.phone,
                    birthDate: formatDate(row.birthDate),
                    birthTime: row.birthTime,
                    birthPlace: row.birthPlace,
                    sessionType: row.sessionType,
                    problem: row.problemCategory,
                    preferredDate: row.preferredDate ? formatDate(row.preferredDate) : undefined,
                    preferredTime: row.preferredTime,
                    amount: row.amount,
                })
            );
        }
        // Otherwise use first available astrologer
        if (astrologers.length > 0) {
            const a = astrologers[0];
            return generateWhatsAppLink(
                a.phone,
                astrologyWhatsAppMessage({
                    astrologerName: a.name,
                    userName: row.name,
                    userPhone: row.phone,
                    birthDate: formatDate(row.birthDate),
                    birthTime: row.birthTime,
                    birthPlace: row.birthPlace,
                    sessionType: row.sessionType,
                    problem: row.problemCategory,
                    preferredDate: row.preferredDate ? formatDate(row.preferredDate) : undefined,
                    preferredTime: row.preferredTime,
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
            searchPlaceholder="Search by name, phone, email..."
            emptyMessage="No astrology requests found"
            exportFilename="astrology_requests"
            whatsappAction={getWhatsAppLink}
            actions={[
                {
                    label: "View",
                    href: (row) => `/admin/astrology/${row._id}`,
                },
            ]}
        />
    );
}
