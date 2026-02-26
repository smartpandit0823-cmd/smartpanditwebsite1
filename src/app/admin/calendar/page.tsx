import { auth } from "@/auth";
import { FestivalRepository } from "@/repositories/festival.repository";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatDate } from "@/lib/utils/index";

export default async function CalendarPage() {
  await auth();
  const repo = new FestivalRepository();
  const result = await repo.list({}, { page: 1, limit: 20 });
  return (
    <div className="space-y-6">
      <div className="flex justify-between"><div><h1 className="font-heading text-3xl font-bold">Festival Calendar</h1><p className="mt-1 text-gray-600">Auspicious dates and muhurats</p></div><Button asChild><Link href="/admin/calendar/new"><Plus className="mr-2 h-4 w-4" />Add Event</Link></Button></div>
      <Card><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Date</TableHead><TableHead>Type</TableHead></TableRow></TableHeader><TableBody>{result.data.map((e: { _id: string; name: string; date: string; type: string }) => (<TableRow key={e._id}><TableCell><Link href={`/admin/calendar/${e._id}`} className="font-medium">{e.name}</Link></TableCell><TableCell>{formatDate(e.date)}</TableCell><TableCell>{e.type}</TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
    </div>
  );
}
