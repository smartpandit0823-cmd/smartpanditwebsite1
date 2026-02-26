import { auth } from "@/auth";
import { CustomerRepository } from "@/repositories/customer.repository";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/index";
import Link from "next/link";

export default async function CustomersPage() {
  await auth();
  const repo = new CustomerRepository();
  const result = await repo.list({}, { page: 1, limit: 20 });
  return (
    <div className="space-y-6">
      <div><h1 className="font-heading text-3xl font-bold">Customers</h1><p className="mt-1 text-gray-600">Manage customer accounts</p></div>
      <Card><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Status</TableHead><TableHead>Total Spent</TableHead></TableRow></TableHeader><TableBody>{result.data.map((c: { _id: string; name: string; email: string; phone?: string; status: string; totalSpent: number }) => (<TableRow key={c._id}><TableCell><Link href={`/admin/customers/${c._id}`} className="font-medium hover:underline">{c.name}</Link></TableCell><TableCell>{c.email}</TableCell><TableCell>{c.phone || "—"}</TableCell><TableCell><Badge>{c.status}</Badge></TableCell><TableCell>{formatCurrency(c.totalSpent)}</TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
    </div>
  );
}
