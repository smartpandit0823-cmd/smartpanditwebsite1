"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, RotateCcw, Eye, ToggleLeft, ToggleRight, Download } from "lucide-react";
import { formatCurrency } from "@/lib/utils/index";
import { softDeletePuja, updatePujaStatus } from "@/actions/puja.actions";
import { StatusBadge } from "@/components/admin/AdminTable";

interface PujaRow {
  _id: string;
  name: string;
  slug: string;
  status: string;
  category: string;
  packages?: { name: string; price: number }[];
  totalBookings?: number;
  featured?: boolean;
  popular?: boolean;
  deletedAt?: string;
}

interface PujaListTableProps {
  data: PujaRow[];
  total: number;
  page: number;
  totalPages: number;
}

export function PujaListTable({ data, total, page, totalPages }: PujaListTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const showingDeleted = searchParams.get("status") === "deleted";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearch() {
    updateParam("search", search);
  }

  async function handleDelete() {
    if (!deleteId) return;
    setLoadingId(deleteId);
    await softDeletePuja(deleteId);
    setDeleteId(null);
    setLoadingId(null);
    startTransition(() => router.refresh());
  }

  async function handleRestore(id: string) {
    setLoadingId(id);
    const res = await fetch(`/api/admin/pujas/${id}/restore`, { method: "POST" });
    setLoadingId(null);
    if (res.ok) startTransition(() => router.refresh());
  }

  async function handleToggleStatus(puja: PujaRow) {
    const next = puja.status === "active" ? "draft" : "active";
    setLoadingId(puja._id);
    await updatePujaStatus(puja._id, next as "draft" | "active");
    setLoadingId(null);
    startTransition(() => router.refresh());
  }

  function exportCSV() {
    const headers = ["Name", "Category", "Status", "Price From", "Bookings", "Featured"];
    const rows = data.map((p) => [
      p.name,
      p.category,
      p.status,
      String(p.packages?.length ? Math.min(...p.packages.map((pk) => pk.price)) : 0),
      String(p.totalBookings || 0),
      String(p.featured || false),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `pujas_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  const minPrice = (p: PujaRow) =>
    p.packages?.length ? Math.min(...p.packages.map((pk) => pk.price)) : 0;

  return (
    <div className="space-y-4">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-1 gap-2 min-w-0">
          <Input
            placeholder="Search pujas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="max-w-xs"
          />
          <Button variant="outline" onClick={handleSearch}>Search</Button>
        </div>

        <Select
          value={searchParams.get("status") || "active"}
          onValueChange={(v) => updateParam("status", v)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="deleted">🗑 Deleted</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get("category") || "all"}
          onValueChange={(v) => updateParam("category", v)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Array.from(new Set(data.map((p) => p.category).filter(Boolean))).map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={exportCSV} className="ml-auto">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>

        <Button asChild>
          <Link href="/admin/pujas/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Puja
          </Link>
        </Button>
      </div>

      {/* ── Stats bar ── */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>{total} puja{total !== 1 ? "s" : ""} found</span>
        {showingDeleted && (
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
            Showing deleted pujas — these are hidden from website
          </span>
        )}
      </div>

      {/* ── Table ── */}
      <div className="rounded-xl border border-gold-200 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-warm-50/50">
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price from</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Flags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                  {showingDeleted ? "No deleted pujas." : "No pujas found. Create your first puja."}
                </TableCell>
              </TableRow>
            ) : (
              data.map((puja) => (
                <TableRow
                  key={puja._id}
                  className={puja.status === "deleted" ? "opacity-60 bg-red-50/30" : "hover:bg-warm-50/30"}
                >
                  <TableCell>
                    <div>
                      <Link
                        href={`/admin/pujas/${puja._id}`}
                        className="font-medium hover:underline text-warm-900"
                      >
                        {puja.name}
                      </Link>
                      <p className="text-xs text-gray-400">/{puja.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell>{puja.category}</TableCell>
                  <TableCell>
                    <StatusBadge status={puja.status} />
                  </TableCell>
                  <TableCell className="font-semibold">{formatCurrency(minPrice(puja))}</TableCell>
                  <TableCell>{puja.totalBookings || 0}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {puja.featured && (
                        <span className="rounded-full bg-saffron-100 px-2 py-0.5 text-[10px] font-semibold text-saffron-700">Featured</span>
                      )}
                      {puja.popular && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">Popular</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1">
                      {puja.status === "deleted" ? (
                        /* Restore button for deleted pujas */
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={loadingId === puja._id}
                          onClick={() => handleRestore(puja._id)}
                          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        >
                          <RotateCcw className="mr-1 h-3 w-3" />
                          Restore
                        </Button>
                      ) : (
                        <>
                          {/* View on website */}
                          <Button variant="ghost" size="icon" asChild title="View on website">
                            <a href={`/puja/${puja.slug}`} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>

                          {/* Toggle Draft/Active */}
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={loadingId === puja._id}
                            onClick={() => handleToggleStatus(puja)}
                            title={puja.status === "active" ? "Set to Draft" : "Set to Active"}
                          >
                            {puja.status === "active" ? (
                              <ToggleRight className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>

                          {/* Edit */}
                          <Button variant="ghost" size="icon" asChild title="Edit">
                            <Link href={`/admin/pujas/${puja._id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>

                          {/* Delete */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(puja._id)}
                            disabled={loadingId === puja._id}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {page} of {totalPages} ({total} total)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline" size="sm" disabled={page <= 1}
              onClick={() => updateParam("page", String(page - 1))}
            >Previous</Button>
            <Button
              variant="outline" size="sm" disabled={page >= totalPages}
              onClick={() => updateParam("page", String(page + 1))}
            >Next</Button>
          </div>
        </div>
      )}

      {/* ── Delete confirm dialog ── */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Puja?</AlertDialogTitle>
            <AlertDialogDescription>
              This puja will be <strong>hidden from the website immediately</strong>. It will be soft-deleted and can be restored from the Deleted filter.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
