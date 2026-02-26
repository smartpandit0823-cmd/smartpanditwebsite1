import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Slider from "@/models/Slider";
import { notFound } from "next/navigation";
import { SliderForm } from "../SliderForm";

export default async function EditSliderPage({ params }: { params: Promise<{ id: string }> }) {
  await auth();
  const { id } = await params;
  await connectDB();
  const slider = await Slider.findById(id).lean();
  if (!slider) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Edit Slider</h1>
        <p className="mt-1 text-gray-600">Update {slider.title}</p>
      </div>
      <SliderForm
        slider={{
          _id: String(slider._id),
          title: slider.title,
          image: slider.image,
          link: slider.link,
          order: slider.order ?? 0,
          active: slider.active ?? true,
        }}
      />
    </div>
  );
}
