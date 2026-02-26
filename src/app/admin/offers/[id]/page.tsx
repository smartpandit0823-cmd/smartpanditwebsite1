import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Offer from "@/models/Offer";
import { notFound } from "next/navigation";
import { OfferForm } from "../OfferForm";

export default async function EditOfferPage({ params }: { params: Promise<{ id: string }> }) {
  await auth();
  const { id } = await params;
  await connectDB();
  const offer = await Offer.findById(id).lean();
  if (!offer) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Edit Offer</h1>
        <p className="mt-1 text-gray-600">Update {offer.title}</p>
      </div>
      <OfferForm
        offer={{
          _id: String(offer._id),
          title: offer.title,
          description: offer.description,
          image: offer.image,
          type: offer.type as "puja" | "store" | "global",
          discount: offer.discount,
          discountType: offer.discountType as "flat" | "percent",
          startDate: offer.startDate ? new Date(offer.startDate).toISOString().slice(0, 10) : undefined,
          endDate: offer.endDate ? new Date(offer.endDate).toISOString().slice(0, 10) : undefined,
          active: offer.active ?? true,
        }}
      />
    </div>
  );
}
