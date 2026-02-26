"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/index";
import { Search, Plus, Pencil } from "lucide-react";

export function ProductListTable({ data, total, page, totalPages }: {
  data: { _id: string; name: string; slug: string; status: string; category: string; pricing?: { sellingPrice: number }; inventory?: { stock: number; lowStockThreshold: number } }[];
  total: number;
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && router.push(`/admin/products?search=${search}`)} className="max-w-sm" />
        <Button onClick={() => router.push(`/admin/products?search=${search}`)}><Search className="mr-2 h-4 w-4" />Search</Button>
        <Button asChild><Link href="/admin/products/new"><Plus className="mr-2 h-4 w-4" />Add Product</Link></Button>
      </div>
      <div className="rounded-xl border border-gold-200 bg-white">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Status</TableHead><TableHead>Price</TableHead><TableHead>Stock</TableHead><TableHead className="text-right">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {data.length === 0 ? <TableRow><TableCell colSpan={6} className="h-24 text-center">No products found.</TableCell></TableRow> : data.map((p) => (
              <TableRow key={p._id}>
                <TableCell><Link href={`/admin/products/${p._id}`} className="font-medium hover:underline">{p.name}</Link></TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell><Badge variant={p.status === "published" ? "success" : "secondary"}>{p.status}</Badge></TableCell>
                <TableCell>{formatCurrency(p.pricing?.sellingPrice || 0)}</TableCell>
                <TableCell><Badge variant={(p.inventory?.stock ?? 0) <= (p.inventory?.lowStockThreshold ?? 5) ? "destructive" : "secondary"}>{p.inventory?.stock ?? 0}</Badge></TableCell>
                <TableCell className="text-right"><Button variant="ghost" size="icon" asChild><Link href={`/admin/products/${p._id}`}><Pencil className="h-4 w-4" /></Link></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && <div className="flex justify-between"><p className="text-sm text-gray-600">Page {page} of {totalPages}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => router.push(`/admin/products?page=${page - 1}`)}>Prev</Button><Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => router.push(`/admin/products?page=${page + 1}`)}>Next</Button></div></div>}
    </div>
  );
}
