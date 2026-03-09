import { auth } from "@/auth";
import { TransactionRepository } from "@/repositories/transaction.repository";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "@/lib/utils/index";

export default async function TransactionsPage() {
  await auth();
  const repo = new TransactionRepository();
  const result = await repo.list({}, { page: 1, limit: 20 });
  return (
    <div className="space-y-6">
      <div><h1 className="font-heading text-3xl font-bold">Transactions</h1><p className="mt-1 text-gray-600">Payment history and refunds</p></div>
      <Card><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Order ID</TableHead><TableHead>Customer</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader><TableBody>{result.data.map((t: any) => (<TableRow key={t._id.toString()}><TableCell className="font-mono text-sm">{t.razorpayOrderId?.slice(0, 20)}...</TableCell><TableCell>{t.customerName}</TableCell><TableCell>{formatCurrency(t.amount)}</TableCell><TableCell><Badge variant={t.status === "captured" ? "success" : t.status === "refunded" ? "destructive" : "secondary"}>{t.status}</Badge></TableCell><TableCell>{formatDateTime(t.createdAt)}</TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
    </div>
  );
}
