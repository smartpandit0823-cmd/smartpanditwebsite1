import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import PujaRequest from "@/models/PujaRequest";
import Pandit from "@/models/Pandit";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "@/lib/utils/index";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PujaRequestActionForm } from "../PujaRequestActionForm";

export default async function PujaRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await auth();
  const { id } = await params;
  await connectDB();
  const req = await PujaRequest.findById(id)
    .populate("pujaId")
    .populate("assignedPanditId")
    .lean();
  if (!req) notFound();

  const puja = req.pujaId as unknown as { name?: string; _id?: string } | null;
  const pandit = req.assignedPanditId as unknown as { name?: string; _id?: string } | null;

  const pandits = await Pandit.find({ status: "active" })
    .select("name phone")
    .lean<{ _id: string; name: string; phone: string }[]>();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/puja-requests">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-heading text-3xl font-bold text-warm-900">Request #{id.slice(-8)}</h1>
          <p className="mt-1 text-gray-600">
            {req.userInfo?.name} • {puja?.name} • {req.packageName}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Name:</strong> {req.userInfo?.name}</p>
            <p><strong>Email:</strong> {req.userInfo?.email}</p>
            <p><strong>Phone:</strong> {req.userInfo?.phone}</p>
            <p><strong>Address:</strong> {req.userInfo?.address}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Puja:</strong> {puja ? <Link href={`/admin/pujas/${puja._id}`} className="text-saffron-600 hover:underline">{puja.name}</Link> : "—"}</p>
            <p><strong>Package:</strong> {req.packageName}</p>
            <p><strong>Date:</strong> {formatDateTime(req.date)} {req.time}</p>
            <p><strong>Amount:</strong> {formatCurrency(req.amount)}</p>
            <p><strong>Status:</strong> <Badge>{req.status}</Badge></p>
            <p><strong>Payment:</strong> <Badge variant={req.paymentStatus === "paid" ? "success" : "secondary"}>{req.paymentStatus}</Badge></p>
            {pandit && <p><strong>Assigned Pandit:</strong> {pandit.name}</p>}
            {req.adminNotes && <p><strong>Admin Notes:</strong> {req.adminNotes}</p>}
          </CardContent>
        </Card>
      </div>

      <PujaRequestActionForm
        requestId={req._id.toString()}
        currentStatus={req.status}
        currentAmount={req.amount}
        currentPanditId={pandit?._id?.toString()}
        adminNotes={req.adminNotes}
        pandits={pandits.map(p => ({
          _id: p._id.toString(),
          name: p.name,
          phone: p.phone
        }))}
      />
    </div>
  );
}
