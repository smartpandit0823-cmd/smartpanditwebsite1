"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ChevronLeft,
    ChevronRight,
    Download,
    Search,
    X,
    MessageCircle,
    Filter,
} from "lucide-react";

// ──────────────── Types ────────────────

export interface AdminColumn<T> {
    key: string;
    label: string;
    render?: (row: T) => React.ReactNode;
    sortable?: boolean;
    className?: string;
}

export interface AdminFilter {
    key: string;
    label: string;
    options: { value: string; label: string }[];
}

export interface AdminAction<T> {
    label: string;
    href?: (row: T) => string;
    onClick?: (row: T) => void;
    icon?: React.ReactNode;
    variant?: "default" | "destructive" | "outline" | "ghost";
    show?: (row: T) => boolean;
}

export interface AdminTableProps<T> {
    data: T[];
    columns: AdminColumn<T>[];
    total: number;
    page: number;
    limit?: number;
    filters?: AdminFilter[];
    actions?: AdminAction<T>[];
    searchPlaceholder?: string;
    emptyMessage?: string;
    enableExport?: boolean;
    exportFilename?: string;
    whatsappAction?: (row: T) => string | null;
    idKey?: string;
}

// ──────────────── Status Badge Colors ────────────────

const STATUS_COLORS: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    verified: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    paid: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    published: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    confirmed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border border-amber-200",
    requested: "bg-amber-50 text-amber-700 border border-amber-200",
    processing: "bg-amber-50 text-amber-700 border border-amber-200",
    assigned: "bg-blue-50 text-blue-700 border border-blue-200",
    inprogress: "bg-blue-50 text-blue-700 border border-blue-200",
    shipped: "bg-blue-50 text-blue-700 border border-blue-200",
    cancelled: "bg-red-50 text-red-700 border border-red-200",
    rejected: "bg-red-50 text-red-700 border border-red-200",
    failed: "bg-red-50 text-red-700 border border-red-200",
    suspended: "bg-red-50 text-red-700 border border-red-200",
    deleted: "bg-gray-50 text-gray-500 border border-gray-200",
    inactive: "bg-gray-50 text-gray-500 border border-gray-200",
    draft: "bg-gray-50 text-gray-500 border border-gray-200",
    blocked: "bg-red-50 text-red-700 border border-red-200",
    refunded: "bg-purple-50 text-purple-700 border border-purple-200",
    partial: "bg-orange-50 text-orange-700 border border-orange-200",
    normal: "bg-gray-50 text-gray-600 border border-gray-200",
    urgent: "bg-orange-50 text-orange-700 border border-orange-200",
    vip: "bg-purple-50 text-purple-700 border border-purple-200",
    created: "bg-slate-50 text-slate-600 border border-slate-200",
};

export function StatusBadge({ status }: { status: string }) {
    const color = STATUS_COLORS[status.toLowerCase()] || "bg-gray-50 text-gray-600 border border-gray-200";
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${color}`}
        >
            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${status.toLowerCase() === "paid" || status.toLowerCase() === "delivered" || status.toLowerCase() === "completed" ? "bg-emerald-500" :
                    status.toLowerCase() === "pending" || status.toLowerCase() === "processing" ? "bg-amber-500" :
                        status.toLowerCase() === "shipped" || status.toLowerCase() === "assigned" ? "bg-blue-500" :
                            status.toLowerCase() === "cancelled" || status.toLowerCase() === "failed" ? "bg-red-500" :
                                "bg-gray-400"
                }`} />
            {status.replace(/_/g, " ")}
        </span>
    );
}

// ──────────────── CSV Export ────────────────

function exportToCSV<T>(
    data: T[],
    columns: AdminColumn<T>[],
    filename: string
) {
    const headers = columns.map((c) => c.label);
    const rows = data.map((row) =>
        columns.map((c) => {
            const val = getNestedValue(row as Record<string, unknown>, c.key);
            return typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val ?? "";
        })
    );
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
}

function getNestedValue(obj: unknown, path: string): unknown {
    return path.split(".").reduce((acc: unknown, part: string) => {
        if (acc && typeof acc === "object" && part in (acc as Record<string, unknown>)) {
            return (acc as Record<string, unknown>)[part];
        }
        return undefined;
    }, obj);
}

// ──────────────── Main Component ────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AdminTable<T extends Record<string, any>>({
    data,
    columns,
    total,
    page,
    limit = 20,
    filters = [],
    actions = [],
    searchPlaceholder = "Search...",
    emptyMessage = "No data found",
    enableExport = true,
    exportFilename = "export",
    whatsappAction,
    idKey = "_id",
}: AdminTableProps<T>) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("q") || "");

    const totalPages = Math.ceil(total / limit);

    const updateParams = useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value && value !== "all") {
                params.set(key, value);
            } else {
                params.delete(key);
            }
            if (key !== "page") params.delete("page");
            router.push(`${pathname}?${params.toString()}`);
        },
        [router, pathname, searchParams]
    );

    function handleSearch() {
        updateParams("q", search);
    }

    function clearSearch() {
        setSearch("");
        updateParams("q", "");
    }

    return (
        <div className="space-y-4">
            {/* ─── Toolbar ─── */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="pl-9 pr-8 h-10 rounded-xl border-gray-200 bg-white focus:border-saffron-300"
                    />
                    {search && (
                        <button
                            onClick={clearSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                {/* Filters */}
                {filters.map((filter) => (
                    <Select
                        key={filter.key}
                        defaultValue={searchParams.get(filter.key) || "all"}
                        onValueChange={(v) => updateParams(filter.key, v)}
                    >
                        <SelectTrigger className="w-[150px] h-10 rounded-xl border-gray-200">
                            <Filter className="h-3.5 w-3.5 mr-2 text-gray-400" />
                            <SelectValue placeholder={filter.label} />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="all">All {filter.label}</SelectItem>
                            {filter.options.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ))}

                {/* Export CSV */}
                {enableExport && data.length > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportToCSV(data as Record<string, unknown>[] as typeof data, columns, exportFilename)}
                        className="ml-auto rounded-xl h-10 border-gray-200"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                )}
            </div>

            {/* ─── Table ─── */}
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/80 border-b border-gray-100">
                            {columns.map((col) => (
                                <TableHead key={col.key} className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.className || ""}`}>
                                    {col.label}
                                </TableHead>
                            ))}
                            {(actions.length > 0 || whatsappAction) && (
                                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + (actions.length > 0 || whatsappAction ? 1 : 0)}
                                    className="h-32 text-center text-gray-400"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row, idx) => (
                                <TableRow key={((row as Record<string, unknown>)[idKey] as string) || idx} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50">
                                    {columns.map((col) => (
                                        <TableCell key={col.key} className={col.className}>
                                            {col.render
                                                ? col.render(row)
                                                : String(getNestedValue(row as Record<string, unknown>, col.key) ?? "—")}
                                        </TableCell>
                                    ))}
                                    {(actions.length > 0 || whatsappAction) && (
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                {whatsappAction && whatsappAction(row) && (
                                                    <a
                                                        href={whatsappAction(row)!}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                                        title="WhatsApp"
                                                    >
                                                        <MessageCircle className="h-4 w-4" />
                                                    </a>
                                                )}
                                                {actions.map((action, i) => {
                                                    if (action.show && !action.show(row)) return null;
                                                    if (action.href) {
                                                        return (
                                                            <Button
                                                                key={i}
                                                                variant={(action.variant as "default") || "ghost"}
                                                                size="sm"
                                                                asChild
                                                                className="rounded-xl"
                                                            >
                                                                <a href={action.href(row)}>
                                                                    {action.icon}
                                                                    {action.label}
                                                                </a>
                                                            </Button>
                                                        );
                                                    }
                                                    return (
                                                        <Button
                                                            key={i}
                                                            variant={(action.variant as "default") || "ghost"}
                                                            size="sm"
                                                            onClick={() => action.onClick?.(row)}
                                                            className="rounded-xl"
                                                        >
                                                            {action.icon}
                                                            {action.label}
                                                        </Button>
                                                    );
                                                })}
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ─── Pagination ─── */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-semibold text-gray-700">{(page - 1) * limit + 1}–{Math.min(page * limit, total)}</span> of <span className="font-semibold text-gray-700">{total}</span>
                    </p>
                    <div className="flex items-center gap-1.5">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page <= 1}
                            onClick={() => updateParams("page", String(page - 1))}
                            className="rounded-xl h-9"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum: number;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (page <= 3) {
                                pageNum = i + 1;
                            } else if (page >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = page - 2 + i;
                            }
                            return (
                                <Button
                                    key={pageNum}
                                    variant={pageNum === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => updateParams("page", String(pageNum))}
                                    className={`rounded-xl h-9 w-9 ${pageNum === page ? "bg-gray-900 hover:bg-gray-800" : ""}`}
                                >
                                    {pageNum}
                                </Button>
                            );
                        })}
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page >= totalPages}
                            onClick={() => updateParams("page", String(page + 1))}
                            className="rounded-xl h-9"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
