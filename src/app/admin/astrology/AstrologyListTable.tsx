"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/utils/index";

export function AstrologyListTable({ data, total, page, totalPages }: {
  data: { _id: string; name: string; phone: string; email?: string; serviceType: string; problemCategory: string; preferredDate?: string; status: string; amount: number }[];
  total: number;
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <Select onValueChange={(v) => router.push(`/admin/astrology?status=${v}`)}>
        <SelectTrigger className="w-[160px]"><SelectValue placeholder="Filter status" /></SelectTrigger>
        <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="requested">Requested</SelectItem><SelectItem value="paid">Paid</SelectItem><SelectItem value="assigned">Assigned</SelectItem><SelectItem value="confirmed">Confirmed</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent>
      </Select>
      <div className="rounded-xl border border-gold-200 bg-white">
        <Table>
          <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Service</TableHead><TableHead>Category</TableHead><TableHead>Preferred</TableHead><TableHead>Status</TableHead><TableHead>Amount</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {data.length === 0 ? <TableRow><TableCell colSpan={7} className="h-24 text-center">No requests.</TableCell></TableRow> : data.map((r) => (
              <TableRow key={r._id}>
                <TableCell><p className="font-medium">{r.name}</p><p className="text-xs text-gray-500">{r.phone}</p></TableCell>
                <TableCell>{r.serviceType}</TableCell>
                <TableCell>{r.problemCategory}</TableCell>
                <TableCell>{r.preferredDate ? formatDate(String(r.preferredDate)) : "—"}</TableCell>
                <TableCell><Badge>{r.status}</Badge></TableCell>
                <TableCell>₹{r.amount}</TableCell>
                <TableCell className="text-right"><Button variant="ghost" size="sm" asChild><Link href={`/admin/astrology/${r._id}`}>View</Link></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && <div className="flex justify-between"><p className="text-sm text-gray-600">Page {page} of {totalPages}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => router.push(`/admin/astrology?page=${page - 1}`)}>Prev</Button><Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => router.push(`/admin/astrology?page=${page + 1}`)}>Next</Button></div></div>}
    </div>
  );
}
