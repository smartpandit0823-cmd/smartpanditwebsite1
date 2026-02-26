import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import TeamMember from "@/models/TeamMember";
import { notFound } from "next/navigation";
import { TeamMemberForm } from "../TeamMemberForm";

export default async function EditTeamMemberPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await auth();
    const { id } = await params;
    await connectDB();

    const member = await TeamMember.findById(id).lean();
    if (!member) notFound();

    const serialized = JSON.parse(JSON.stringify(member));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-heading text-3xl font-bold text-warm-900">Edit Team Member</h1>
                <p className="mt-1 text-gray-600">Update {serialized.name}&apos;s profile</p>
            </div>
            <TeamMemberForm initialData={serialized} />
        </div>
    );
}
