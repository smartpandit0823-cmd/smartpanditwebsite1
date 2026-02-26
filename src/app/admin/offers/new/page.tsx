import { auth } from "@/auth";
import { OfferForm } from "../OfferForm";

export default async function NewOfferPage() {
  await auth();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Add Offer</h1>
        <p className="mt-1 text-gray-600">Create a new offer or promotion</p>
      </div>
      <OfferForm />
    </div>
  );
}
