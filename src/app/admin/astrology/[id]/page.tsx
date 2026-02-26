import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import AstroRequest from "@/models/AstroRequest";
import Pandit from "@/models/Pandit";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/index";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AstrologyAssignForm } from "../AstrologyAssignForm";

export default async function AstrologyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await auth();
  const { id } = await params;
  await connectDB();
  const req = await AstroRequest.findById(id)
    .populate("userId", "name phone email")
    .populate("assignedAstrologerId", "name phone")
    .lean();
  if (!req) notFound();

  const user = req.userId as { name?: string; phone?: string; email?: string } | null;
  const astrologer = req.assignedAstrologerId as { name?: string; phone?: string } | null;
  const pandits = await Pandit.find({ status: "active", verificationStatus: "verified" }).select("name phone").lean();
  const finalCallTimeStr = req.finalCallTime
    ? new Date(req.finalCallTime).toISOString().slice(0, 16)
    : "";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild><Link href="/admin/astrology"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <div>
          <h1 className="font-heading text-3xl font-bold">{user?.name || user?.phone || "User"}</h1>
          <p className="mt-1 text-gray-600">{req.problemCategory} • {req.status}</p>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle>Details</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Phone:</strong> {user?.phone || "—"}</p>
          <p><strong>Email:</strong> {user?.email || "—"}</p>
          <p><strong>Service:</strong> {req.serviceType}</p>
          <p><strong>Birth:</strong> {formatDate(req.birthDate)} {req.birthTime || ""} at {req.birthPlace}</p>
          <p><strong>Preferred:</strong> {req.preferredDate ? formatDate(req.preferredDate) : "—"} {req.preferredTime || ""}</p>
          <p><strong>Session:</strong> {req.sessionType} min</p>
          <p><strong>Status:</strong> <Badge>{req.status}</Badge></p>
          <p><strong>Payment:</strong> <Badge>{req.paymentStatus}</Badge></p>
          <p><strong>Amount:</strong> ₹{req.amount}</p>
          {astrologer && <p><strong>Assigned Astrologer:</strong> {astrologer.name} ({astrologer.phone})</p>}
          {req.finalCallTime && <p><strong>Call Scheduled:</strong> {new Date(req.finalCallTime).toLocaleString()}</p>}
          {req.notes && <p><strong>Notes:</strong> {req.notes}</p>}
        </CardContent>
      </Card>
      {["paid", "assigned"].includes(req.status) && (
        <AstrologyAssignForm
          requestId={id}
          currentAstrologer={req.assignedAstrologerId ? String((req.assignedAstrologerId as { _id?: unknown })?._id ?? req.assignedAstrologerId) : undefined}
          currentFinalCallTime={finalCallTimeStr}
          pandits={pandits.map((p) => ({ _id: String(p._id), name: p.name, phone: p.phone }))}
        />
      )}
    </div>
  );
}
