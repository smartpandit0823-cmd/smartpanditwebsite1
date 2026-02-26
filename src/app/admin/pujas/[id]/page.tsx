import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Puja from "@/models/Puja";
import { notFound } from "next/navigation";
import { PujaForm } from "../PujaForm";

export default async function EditPujaPage({ params }: { params: Promise<{ id: string }> }) {
  await auth();
  const { id } = await params;
  await connectDB();
  const puja = await Puja.findById(id).lean();
  if (!puja) notFound();

  const data = JSON.parse(
    JSON.stringify({
      ...puja,
      _id: puja._id.toString(),
      packages: (puja.packages || []).map((p: { _id?: unknown; [k: string]: unknown }) => ({
        ...p,
        _id: p._id?.toString?.() ?? "",
      })),
      bookingSettings: puja.bookingSettings || {},
      seo: puja.seo || { seoTitle: "", metaDescription: "", keywords: [] },
      discount: puja.discount,
    })
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-warm-900">Edit Puja</h1>
        <p className="mt-1 text-gray-600">Update {puja.name}</p>
      </div>
      <PujaForm puja={data as Parameters<typeof PujaForm>[0]["puja"]} />
    </div>
  );
}
