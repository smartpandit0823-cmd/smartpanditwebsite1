import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import TeamMember from "@/models/TeamMember";
import { TeamTable } from "./TeamTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function TeamPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; role?: string; status?: string; q?: string }>;
}) {
    await auth();
    const params = await searchParams;
    const page = parseInt(params.page || "1");
    const limit = 20;
    await connectDB();

    const filter: Record<string, unknown> = { deletedAt: { $exists: false } };
    if (params.role && params.role !== "all") filter.role = params.role;
    if (params.status && params.status !== "all") filter.status = params.status;
    if (params.q) {
        filter.$or = [
            { name: { $regex: params.q, $options: "i" } },
            { phone: { $regex: params.q, $options: "i" } },
            { area: { $regex: params.q, $options: "i" } },
        ];
    }

    const [data, total] = await Promise.all([
        TeamMember.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
        TeamMember.countDocuments(filter),
    ]);

    const serialized = JSON.parse(JSON.stringify(data));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-heading text-3xl font-bold text-warm-900">Team Management</h1>
                    <p className="mt-1 text-gray-600">Manage pandits, astrologers & support staff</p>
                </div>
                <Button asChild>
                    <Link href="/admin/team/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Member
                    </Link>
                </Button>
            </div>
            <TeamTable data={serialized} total={total} page={page} />
        </div>
    );
}
