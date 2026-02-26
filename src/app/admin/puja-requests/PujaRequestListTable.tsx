"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils/index";
import { MessageCircle, Phone } from "lucide-react";

const statusVariant: Record<string, "default" | "secondary" | "success" | "warning" | "destructive" | "pending"> = {
  requested: "pending",
  price_finalized: "warning",
  payment_pending: "warning",
  confirmed: "success",
  assigned: "secondary",
  inprogress: "warning",
  completed: "success",
  submitted: "success",
  cancelled: "destructive",
};

export function PujaRequestListTable({
  data,
  total,
  page,
  totalPages,
}: {
  data: { _id: string; userInfo: { name: string; email: string; phone: string }; pujaId?: { name: string }; packageName: string; date: string; time: string; status: string; paymentStatus: string; amount: number }[];
  total: number;
  page: number;
  totalPages: number;
}) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Select
          onValueChange={(v) => router.push(`/admin/puja-requests?status=${v}&page=1`)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="requested">Requested</SelectItem>
            <SelectItem value="price_finalized">Price Finalized</SelectItem>
            <SelectItem value="payment_pending">Payment Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="inprogress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-gold-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Puja</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No requests found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((req) => (
                <TableRow key={req._id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{req.userInfo?.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">{req.userInfo?.phone}</p>
                        {req.userInfo?.phone && (
                          <>
                            <a href={`tel:${req.userInfo.phone}`} className="text-blue-500 hover:text-blue-700" title="Call User">
                              <Phone size={12} />
                            </a>
                            <a
                              href={`https://wa.me/91${req.userInfo.phone.replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(`Hari Om ${req.userInfo.name || "Ji"},\n\nWe received your booking request for ${(req.pujaId as { name?: string })?.name || "Puja"}. Our team will contact you shortly.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#25D366] hover:text-[#1ead51]"
                              title="WhatsApp User"
                            >
                              <MessageCircle size={12} />
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{(req.pujaId as { name?: string })?.name || "—"}</TableCell>
                  <TableCell className="capitalize">{req.packageName}</TableCell>
                  <TableCell>
                    {formatDate(req.date)} {req.time}
                  </TableCell>
                  <TableCell>{formatCurrency(req.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[req.status] || "secondary"}>{req.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={req.paymentStatus === "paid" ? "success" : "pending"}>
                      {req.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/puja-requests/${req._id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Page {page} of {totalPages} ({total} total)</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => router.push(`/admin/puja-requests?page=${page - 1}`)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => router.push(`/admin/puja-requests?page=${page + 1}`)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
