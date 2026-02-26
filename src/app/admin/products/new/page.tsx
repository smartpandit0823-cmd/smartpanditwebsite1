import { ProductForm } from "../ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-warm-900">Add Product</h1>
        <p className="mt-1 text-gray-600">Create a new product for the store</p>
      </div>
      <ProductForm />
    </div>
  );
}
