import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Banner from "@/models/Banner";
import { notFound } from "next/navigation";
import { BannerForm } from "../BannerForm";

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  await auth();
  const { id } = await params;
  await connectDB();
  const banner = await Banner.findById(id).lean();
  if (!banner) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Edit Banner</h1>
        <p className="mt-1 text-gray-600">Update {banner.title}</p>
      </div>
      <BannerForm
        banner={{
          _id: String(banner._id),
          title: banner.title,
          subtitle: banner.subtitle,
          image: banner.image,
          mobileImage: banner.mobileImage,
          link: banner.link,
          position: banner.position as "home" | "puja" | "store" | "astrology",
          status: banner.status as "active" | "inactive",
          order: banner.order ?? 0,
          startsAt: banner.startsAt ? new Date(banner.startsAt).toISOString() : undefined,
          endsAt: banner.endsAt ? new Date(banner.endsAt).toISOString() : undefined,
        }}
      />
    </div>
  );
}
