import { auth } from "@/auth";
import { SliderForm } from "../SliderForm";

export default async function NewSliderPage() {
  await auth();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Add Slider</h1>
        <p className="mt-1 text-gray-600">Create a new homepage slider</p>
      </div>
      <SliderForm />
    </div>
  );
}
