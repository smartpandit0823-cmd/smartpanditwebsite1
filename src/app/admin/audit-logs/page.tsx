import { auth } from "@/auth";
import { AuditRepository } from "@/repositories/audit.repository";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils/index";

export default async function AuditLogsPage() {
  await auth();
  const repo = new AuditRepository();
  const result = await repo.list({}, { page: 1, limit: 50 });
  return (
    <div className="space-y-6">
      <div><h1 className="font-heading text-3xl font-bold">Audit Logs</h1><p className="mt-1 text-gray-600">Admin activity trail</p></div>
      <Card><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Time</TableHead><TableHead>Admin</TableHead><TableHead>Action</TableHead><TableHead>Entity</TableHead><TableHead>Description</TableHead></TableRow></TableHeader><TableBody>{result.data.map((a: any) => (<TableRow key={String(a._id)}><TableCell>{formatDateTime(a.createdAt)}</TableCell><TableCell>{a.adminName}</TableCell><TableCell>{a.action}</TableCell><TableCell>{a.entity}</TableCell><TableCell className="max-w-md truncate">{a.description}</TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
    </div>
  );
}
