import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Slider from "@/models/Slider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export default async function SlidersPage() {
  await auth();
  await connectDB();
  const sliders = await Slider.find({}).sort({ order: 1 }).lean() as any[];

  return (
    <div className="space-y-6">
      <div className="flex justify-between"><div><h1 className="font-heading text-3xl font-bold">Sliders</h1><p className="mt-1 text-gray-600">Homepage sliders</p></div><Button asChild><Link href="/admin/sliders/new"><Plus className="mr-2 h-4 w-4" />Add Slider</Link></Button></div>
      <Card><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Order</TableHead><TableHead>Active</TableHead></TableRow></TableHeader><TableBody>{sliders.map((s: any) => (<TableRow key={s._id.toString()}><TableCell><Link href={`/admin/sliders/${s._id.toString()}`} className="font-medium">{s.title}</Link></TableCell><TableCell>{s.order}</TableCell><TableCell><Badge variant={s.active ? "success" : "secondary"}>{s.active ? "Active" : "Inactive"}</Badge></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
    </div>
  );
}
