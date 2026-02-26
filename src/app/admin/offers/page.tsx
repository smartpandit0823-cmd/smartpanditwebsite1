import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Offer from "@/models/Offer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export default async function OffersPage() {
  await auth();
  await connectDB();
  const offers = await Offer.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-6">
      <div className="flex justify-between"><div><h1 className="font-heading text-3xl font-bold">Offers</h1><p className="mt-1 text-gray-600">Discounts and promotions</p></div><Button asChild><Link href="/admin/offers/new"><Plus className="mr-2 h-4 w-4" />Add Offer</Link></Button></div>
      <Card><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Type</TableHead><TableHead>Discount</TableHead><TableHead>Active</TableHead></TableRow></TableHeader><TableBody>{offers.map((o: { _id: string; title: string; type: string; discount: number; discountType: string; active: boolean }) => (<TableRow key={o._id}><TableCell><Link href={`/admin/offers/${o._id}`} className="font-medium">{o.title}</Link></TableCell><TableCell>{o.type}</TableCell><TableCell>{o.discount}{o.discountType === "percent" ? "%" : "₹"}</TableCell><TableCell><Badge variant={o.active ? "success" : "secondary"}>{o.active ? "Active" : "Inactive"}</Badge></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
    </div>
  );
}
