"use client";

import { AdminTable, StatusBadge } from "@/components/admin/AdminTable";
import { formatCurrency, formatDate } from "@/lib/utils/index";
import type { AdminColumn, AdminFilter } from "@/components/admin/AdminTable";
import Link from "next/link";
import {
    Eye,
    Package,
    MapPin,
    Phone,
} from "lucide-react";

interface OrderRow {
    _id: string;
    userId: { phone: string; name?: string } | null;
    items: { name: string; quantity: number; price: number; image?: string }[];
    totalAmount: number;
    status: string;
    paymentStatus: string;
    shippingAddress: { name: string; phone: string; city: string; state: string; pincode: string; address: string };
    trackingId?: string;
    razorpayPaymentId?: string;
    createdAt: string;
}

const columns: AdminColumn<OrderRow>[] = [
    {
        key: "_id",
        label: "Order ID",
        render: (row) => (
            <Link href={`/admin/orders/${row._id}`} className="text-xs font-mono font-semibold text-saffron-600 hover:text-saffron-700">
                #{row._id.slice(-8).toUpperCase()}
            </Link>
        ),
    },
    {
        key: "shippingAddress",
        label: "Customer",
        render: (row) => (
            <div className="min-w-[140px]">
                <p className="text-sm font-semibold text-gray-900">{row.shippingAddress?.name || "—"}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Phone className="h-3 w-3" />
                    {row.shippingAddress?.phone}
                </p>
            </div>
        ),
    },
    {
        key: "items",
        label: "Items",
        render: (row) => (
            <div className="min-w-[120px]">
                {row.items.slice(0, 2).map((item, i) => (
                    <p key={i} className="text-sm text-gray-700">
                        {item.name} <span className="text-gray-400">× {item.quantity}</span>
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
        render: (row) => (
            <span className="text-sm font-bold text-gray-900">{formatCurrency(row.totalAmount)}</span>
        ),
    },
    {
        key: "status",
        label: "Order Status",
        render: (row) => <StatusBadge status={row.status} />,
    },
    {
        key: "paymentStatus",
        label: "Payment",
        render: (row) => <StatusBadge status={row.paymentStatus} />,
    },
    {
        key: "shippingAddress.city",
        label: "Location",
        render: (row) => (
            <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="h-3 w-3 text-gray-400" />
                {row.shippingAddress?.city || "—"}, {row.shippingAddress?.pincode || ""}
            </div>
        ),
    },
    {
        key: "createdAt",
        label: "Date",
        render: (row) => (
            <span className="text-sm text-gray-500">{formatDate(row.createdAt)}</span>
        ),
    },
];

const filters: AdminFilter[] = [
    {
        key: "status",
        label: "Status",
        options: [
            { value: "all", label: "All (incl. pending)" },
            { value: "created", label: "Pending / Created" },
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
        <div className="animate-fade-in-up">
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
                        icon: <Eye className="mr-1.5 h-3.5 w-3.5" />,
                        href: (row) => `/admin/orders/${row._id}`,
                    },
                ]}
            />
        </div>
    );
}
