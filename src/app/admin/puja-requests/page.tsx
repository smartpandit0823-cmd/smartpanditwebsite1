import { auth } from "@/auth";
import { PujaRequestRepository } from "@/repositories/puja-request.repository";
import { PujaRequestListTable } from "./PujaRequestListTable";

export default async function PujaRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  await auth();
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const repo = new PujaRequestRepository();
  const statusFilter = params.status && params.status !== "all" ? params.status : undefined;
  const result = await repo.list(
    { status: statusFilter as "requested" | "assigned" | "inprogress" | "completed" | undefined },
    { page, limit: 20 }
  );

  const serialized = JSON.parse(JSON.stringify(result.data));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-warm-900">Puja Requests</h1>
        <p className="mt-1 text-gray-600">Manage booking requests and assignments</p>
      </div>
      <PujaRequestListTable
        data={serialized}
        total={result.total}
        page={result.page}
        totalPages={result.totalPages}
      />
    </div>
  );
}
