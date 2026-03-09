import { auth } from "@/auth";
import { ProductRepository } from "@/repositories/product.repository";
import { ProductListTable } from "./ProductListTable";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  await auth();
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const repo = new ProductRepository();
  const result = await repo.list(
    { search: params.search, status: params.status as "draft" | "published" | undefined },
    { page, limit: 20 }
  );

  const serialized = JSON.parse(JSON.stringify(result.data));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>Products</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your product catalog</p>
      </div>
      <ProductListTable data={serialized} total={result.total} page={result.page} totalPages={result.totalPages} />
    </div>
  );
}
