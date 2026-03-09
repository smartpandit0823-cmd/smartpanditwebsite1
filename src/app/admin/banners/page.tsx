import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Banner from "@/models/Banner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export default async function BannersPage() {
  await auth();
  await connectDB();
  const banners = await Banner.find({}).sort({ order: 1, createdAt: -1 }).lean() as any[];
  return (
    <div className="space-y-6">
      <div className="flex justify-between"><div><h1 className="font-heading text-3xl font-bold">Banners</h1><p className="mt-1 text-gray-600">Promotional banners</p></div><Button asChild><Link href="/admin/banners/new"><Plus className="mr-2 h-4 w-4" />Add Banner</Link></Button></div>
      <Card><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Position</TableHead><TableHead>Order</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{banners.map((b: any) => (<TableRow key={b._id.toString()}><TableCell><Link href={`/admin/banners/${b._id.toString()}`} className="font-medium">{b.title}</Link></TableCell><TableCell>{b.position}</TableCell><TableCell>{b.order}</TableCell><TableCell><Badge variant={b.status === "active" ? "success" : "secondary"}>{b.status}</Badge></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
    </div>
  );
}
