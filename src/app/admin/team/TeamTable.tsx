"use client";

import Link from "next/link";
import { AdminTable, StatusBadge } from "@/components/admin/AdminTable";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import type { AdminColumn, AdminFilter } from "@/components/admin/AdminTable";

interface TeamRow {
    _id: string;
    name: string;
    phone: string;
    role: string;
    skills: string[];
    area: string;
    city: string;
    status: string;
    verificationStatus: string;
    totalCompleted: number;
    averageRating: number;
    photo?: string;
}

const columns: AdminColumn<TeamRow>[] = [
    {
        key: "name",
        label: "Name",
        render: (row) => (
            <Link href={`/admin/team/${row._id}`} className="font-medium text-warm-900 hover:text-saffron-600 hover:underline">
                {row.name}
            </Link>
        ),
    },
    {
        key: "role",
        label: "Role",
        render: (row) => <StatusBadge status={row.role} />,
    },
    { key: "phone", label: "Phone" },
    {
        key: "skills",
        label: "Skills",
        render: (row) => (
            <div className="flex flex-wrap gap-1 max-w-xs">
                {(row.skills || []).slice(0, 3).map((s) => (
                    <span key={s} className="inline-block rounded bg-saffron-50 px-2 py-0.5 text-xs text-saffron-700">
                        {s}
                    </span>
                ))}
                {(row.skills || []).length > 3 && (
                    <span className="text-xs text-gray-400">+{row.skills.length - 3}</span>
                )}
            </div>
        ),
    },
    { key: "area", label: "Area" },
    {
        key: "status",
        label: "Status",
        render: (row) => <StatusBadge status={row.status} />,
    },
    {
        key: "verificationStatus",
        label: "Verified",
        render: (row) => <StatusBadge status={row.verificationStatus} />,
    },
    {
        key: "totalCompleted",
        label: "Completed",
        render: (row) => <span className="font-semibold">{row.totalCompleted}</span>,
    },
    {
        key: "averageRating",
        label: "Rating",
        render: (row) => (
            <span className="text-gold-600 font-medium">★ {row.averageRating.toFixed(1)}</span>
        ),
    },
];

const filters: AdminFilter[] = [
    {
        key: "role",
        label: "Role",
        options: [
            { value: "pandit", label: "Pandit" },
            { value: "astrologer", label: "Astrologer" },
            { value: "support", label: "Support" },
            { value: "delivery", label: "Delivery" },
        ],
    },
    {
        key: "status",
        label: "Status",
        options: [
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "suspended", label: "Suspended" },
        ],
    },
];

export function TeamTable({
    data,
    total,
    page,
}: {
    data: TeamRow[];
    total: number;
    page: number;
}) {
    return (
        <AdminTable
            data={data}
            columns={columns}
            total={total}
            page={page}
            filters={filters}
            searchPlaceholder="Search by name, phone, area..."
            emptyMessage="No team members found"
            exportFilename="team_members"
            whatsappAction={(row) =>
                generateWhatsAppLink(row.phone, `🙏 नमस्ते ${row.name} जी, SmartPandit Admin यहाँ से बात कर रहे हैं।`)
            }
            actions={[
                {
                    label: "View",
                    href: (row) => `/admin/team/${row._id}`,
                },
            ]}
        />
    );
}
