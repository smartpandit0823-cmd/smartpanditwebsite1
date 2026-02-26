import { auth } from "@/auth";
import { PujaRepository } from "@/repositories/puja.repository";
import { PujaListTable } from "./PujaListTable";

export const metadata = {
  title: "Pujas — Admin",
};

export default async function PujasPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string; category?: string }>;
}) {
  await auth();
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);

  // Default: active. Explicit "all" shows everything. "deleted"/"draft" show those.
  const rawStatus = params.status;
  const statusFilter =
    rawStatus === "all" ? undefined :
      rawStatus === "deleted" ? "deleted" as const :
        rawStatus === "draft" ? "draft" as const :
          "active" as const;

  const pujaRepo = new PujaRepository();
  const result = await pujaRepo.list(
    {
      search: params.search,
      status: statusFilter,
      category: params.category,
    },
    { page, limit: 20 }
  );

  const serialized = JSON.parse(JSON.stringify(result.data));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-warm-900">Pujas</h1>
          <p className="mt-1 text-gray-600">
            Manage your puja catalog — {result.total} result{result.total !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <PujaListTable
        data={serialized}
        total={result.total}
        page={result.page}
        totalPages={result.totalPages}
      />
    </div>
  );
}
