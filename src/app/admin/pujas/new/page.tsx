import { PujaForm } from "../PujaForm";

export default function NewPujaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-warm-900">Create Puja</h1>
        <p className="mt-1 text-gray-600">Add a new puja to your catalog</p>
      </div>
      <PujaForm />
    </div>
  );
}
