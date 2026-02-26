"use client";

import { AdminTable, StatusBadge } from "@/components/admin/AdminTable";
import { formatCurrency, formatDate } from "@/lib/utils/index";
import type { AdminColumn, AdminFilter } from "@/components/admin/AdminTable";

interface OrderRow {
    _id: string;
    userId: { phone: string; name?: string } | null;
    items: { name: string; quantity: number; price: number }[];
    totalAmount: number;
    status: string;
    paymentStatus: string;
    shippingAddress: { name: string; phone: string; city: string; pincode: string };
    trackingId?: string;
    createdAt: string;
}

const columns: AdminColumn<OrderRow>[] = [
    {
        key: "shippingAddress",
        label: "Customer",
        render: (row) => (
            <div>
                <p className="font-medium">{row.shippingAddress?.name || "—"}</p>
                <p className="text-xs text-gray-500">{row.shippingAddress?.phone}</p>
            </div>
        ),
    },
    {
        key: "items",
        label: "Items",
        render: (row) => (
            <div>
                {row.items.slice(0, 2).map((item, i) => (
                    <p key={i} className="text-sm">
                        {item.name} × {item.quantity}
                    </p>
                ))}
                {row.items.length > 2 && (
                    <p className="text-xs text-gray-400">+{row.items.length - 2} more</p>
                )}
            </div>
        ),
    },
    {
        key: "totalAmount",
        label: "Total",
        render: (row) => <span className="font-semibold">{formatCurrency(row.totalAmount)}</span>,
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
        key: "shippingAddress.city",
        label: "City",
        render: (row) => `${row.shippingAddress?.city || "—"} - ${row.shippingAddress?.pincode || ""}`,
    },
    {
        key: "createdAt",
        label: "Date",
        render: (row) => formatDate(row.createdAt),
    },
];

const filters: AdminFilter[] = [
    {
        key: "status",
        label: "Status",
        options: [
            { value: "created", label: "Created" },
            { value: "paid", label: "Paid" },
            { value: "processing", label: "Processing" },
            { value: "shipped", label: "Shipped" },
            { value: "delivered", label: "Delivered" },
            { value: "cancelled", label: "Cancelled" },
        ],
    },
];

export function OrdersTable({
    data,
    total,
    page,
}: {
    data: OrderRow[];
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
            searchPlaceholder="Search by customer name or phone..."
            emptyMessage="No orders found"
            exportFilename="orders"
            actions={[
                {
                    label: "View",
                    href: (row) => `/admin/orders/${row._id}`,
                },
            ]}
        />
    );
}
