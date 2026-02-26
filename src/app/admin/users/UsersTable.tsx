"use client";

import { AdminTable } from "@/components/admin/AdminTable";
import { formatDate } from "@/lib/utils/index";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import type { AdminColumn } from "@/components/admin/AdminTable";
import Link from "next/link";

interface UserRow {
    _id: string;
    name?: string;
    phone: string;
    email?: string;
    city?: string;
    createdAt: string;
    addresses?: unknown[];
}

const columns: AdminColumn<UserRow>[] = [
    {
        key: "name",
        label: "Name",
        render: (row) => (
            <Link href={`/admin/users/${row._id}`} className="font-medium text-saffron-700 hover:underline">
                {row.name || "—"}
            </Link>
        ),
    },
    { key: "phone", label: "Phone" },
    {
        key: "email",
        label: "Email",
        render: (row) => <span className="text-sm">{row.email || "—"}</span>,
    },
    {
        key: "city",
        label: "City",
        render: (row) => row.city || "—",
    },
    {
        key: "createdAt",
        label: "Joined",
        render: (row) => formatDate(row.createdAt),
    },
];

export function UsersTable({
    data,
    total,
    page,
}: {
    data: UserRow[];
    total: number;
    page: number;
}) {
    return (
        <AdminTable
            data={data}
            columns={columns}
            total={total}
            page={page}
            searchPlaceholder="Search by name, phone, email..."
            emptyMessage="No users found"
            exportFilename="users"
            whatsappAction={(row) =>
                generateWhatsAppLink(row.phone, `🙏 नमस्ते ${row.name || ""}, SmartPandit Admin here.`)
            }
        />
    );
}
