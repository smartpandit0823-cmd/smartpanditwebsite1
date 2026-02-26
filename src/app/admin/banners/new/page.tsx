import { auth } from "@/auth";
import { BannerForm } from "../BannerForm";

export default async function NewBannerPage() {
  await auth();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Add Banner</h1>
        <p className="mt-1 text-gray-600">Create a new promotional banner</p>
      </div>
      <BannerForm />
    </div>
  );
}
