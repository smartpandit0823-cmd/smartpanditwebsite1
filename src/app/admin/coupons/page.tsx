import { auth } from "@/auth";
import { CouponRepository } from "@/repositories/coupon.repository";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { formatDate } from "@/lib/utils/index";

export default async function CouponsPage() {
  await auth();
  const repo = new CouponRepository();
  const result = await repo.list({}, { page: 1, limit: 20 });
  return (
    <div className="space-y-6">
      <div className="flex justify-between"><div><h1 className="font-heading text-3xl font-bold">Coupons</h1><p className="mt-1 text-gray-600">Discount codes and offers</p></div><Button asChild><Link href="/admin/coupons/new"><Plus className="mr-2 h-4 w-4" />Add Coupon</Link></Button></div>
      <Card><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Type</TableHead><TableHead>Value</TableHead><TableHead>Usage</TableHead><TableHead>Expires</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{result.data.map((c: { _id: string; code: string; type: string; value: number; usageCount: number; usageLimit: number; expiresAt?: string; status: string }) => (<TableRow key={c._id}><TableCell><Link href={`/admin/coupons/${c._id}`} className="font-mono font-medium">{c.code}</Link></TableCell><TableCell>{c.type}</TableCell><TableCell>{c.type === "percent" ? `${c.value}%` : `₹${c.value}`}</TableCell><TableCell>{c.usageCount}/{c.usageLimit}</TableCell><TableCell>{c.expiresAt ? formatDate(c.expiresAt) : "Never"}</TableCell><TableCell><Badge variant={c.status === "active" ? "success" : "secondary"}>{c.status}</Badge></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
    </div>
  );
}
