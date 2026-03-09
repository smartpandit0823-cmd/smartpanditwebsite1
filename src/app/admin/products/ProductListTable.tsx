"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils/index";
import {
  Search,
  Plus,
  Pencil,
  Eye,
  Trash2,
  Download,
  Filter,
  Package,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  ImageIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProductRow {
  _id: string;
  name: string;
  slug: string;
  status: string;
  category: string;
  mainImage?: string;
  pricing?: { sellingPrice: number; mrp: number; discount: number };
  inventory?: { stock: number; lowStockThreshold: number; inStock: boolean };
  totalSold?: number;
  featured?: boolean;
  trending?: boolean;
}

const statusColors: Record<string, string> = {
  published: "bg-emerald-100 text-emerald-700 border-emerald-200",
  draft: "bg-gray-100 text-gray-600 border-gray-200",
  deleted: "bg-red-100 text-red-600 border-red-200",
};

export function ProductListTable({
  data,
  total,
  page,
  totalPages,
}: {
  data: ProductRow[];
  total: number;
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  function navigate(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== "page") params.delete("page");
    router.push(`/admin/products?${params.toString()}`);
  }

  function handleSearch() {
    navigate("search", search);
  }

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* ─── Toolbar ─── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search products by name, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9 pr-4 h-10 rounded-xl border-gray-200 bg-white focus:border-saffron-300 focus:ring-saffron-200"
          />
        </div>

        <Select
          defaultValue={searchParams.get("status") || "all"}
          onValueChange={(v) => navigate("status", v)}
        >
          <SelectTrigger className="w-[140px] h-10 rounded-xl border-gray-200">
            <Filter className="h-3.5 w-3.5 mr-2 text-gray-400" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" className="rounded-xl border-gray-200 h-10">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button asChild className="rounded-xl h-10 bg-gray-900 hover:bg-gray-800">
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* ─── Stats bar ─── */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-500">
          <span className="font-semibold text-gray-900">{total}</span> products total
        </span>
        <span className="h-4 w-px bg-gray-200" />
        <span className="text-gray-500">
          Page <span className="font-semibold text-gray-900">{page}</span> of{" "}
          <span className="font-semibold text-gray-900">{totalPages}</span>
        </span>
      </div>

      {/* ─── Table ─── */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 border-b border-gray-100">
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-5">
                Product
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Category
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Price
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Stock
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Sold
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-right pr-5">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Package className="h-10 w-10 text-gray-300" />
                    <p className="text-sm text-gray-400">No products found</p>
                    <Button asChild variant="outline" size="sm" className="mt-2 rounded-xl">
                      <Link href="/admin/products/new">Add your first product</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((p) => {
                const lowStock =
                  (p.inventory?.stock ?? 0) <= (p.inventory?.lowStockThreshold ?? 5);
                return (
                  <TableRow
                    key={p._id}
                    className="hover:bg-gray-50/50 transition-colors border-b border-gray-50"
                  >
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                          {p.mainImage ? (
                            <img
                              src={p.mainImage}
                              alt={p.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/products/${p._id}`}
                            className="text-sm font-semibold text-gray-900 hover:text-saffron-600 transition-colors truncate block"
                          >
                            {p.name}
                          </Link>
                          <p className="text-xs text-gray-400 truncate">{p.slug}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                        {p.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize border ${statusColors[p.status] || "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {p.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(p.pricing?.sellingPrice || 0)}
                        </p>
                        {p.pricing?.discount ? (
                          <p className="text-xs text-gray-400 line-through">
                            {formatCurrency(p.pricing?.mrp || 0)}
                          </p>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${lowStock
                          ? "bg-rose-100 text-rose-700"
                          : "bg-emerald-100 text-emerald-700"
                          }`}
                      >
                        {p.inventory?.stock ?? 0}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-gray-700">
                        {p.totalSold ?? 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl w-44">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/${p._id}`} className="flex items-center gap-2">
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/product/${p.slug}`} target="_blank" className="flex items-center gap-2">
                              <Eye className="h-3.5 w-3.5" />
                              View Live
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer"
                            onClick={async () => {
                              if (window.confirm(`Are you sure you want to delete "${p.name}"?\nThis action cannot be undone.`)) {
                                const { deleteProduct } = await import('@/actions/product.actions');
                                await deleteProduct(p._id);
                              }
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* ─── Pagination ─── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => navigate("page", String(page - 1))}
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
                  onClick={() => navigate("page", String(pageNum))}
                  className={`rounded-xl h-9 w-9 ${pageNum === page ? "bg-gray-900 hover:bg-gray-800" : ""
                    }`}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => navigate("page", String(page + 1))}
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
