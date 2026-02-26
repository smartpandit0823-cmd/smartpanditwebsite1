import { TeamMemberForm } from "../TeamMemberForm";

export default function NewTeamMemberPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-heading text-3xl font-bold text-warm-900">Add Team Member</h1>
                <p className="mt-1 text-gray-600">Add a new pandit, astrologer or support member</p>
            </div>
            <TeamMemberForm />
        </div>
    );
}
