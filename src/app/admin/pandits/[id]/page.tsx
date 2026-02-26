import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Pandit from "@/models/Pandit";
import { notFound } from "next/navigation";
import { PanditForm } from "../PanditForm";

export default async function EditPanditPage({ params }: { params: Promise<{ id: string }> }) {
    await auth();
    const { id } = await params;
    await connectDB();
    const pandit = await Pandit.findById(id).lean();
    if (!pandit) notFound();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-heading text-3xl font-bold">Edit Pandit</h1>
                <p className="mt-1 text-gray-600">Update pandit profile, skills, area, and status</p>
            </div>
            <PanditForm initialData={JSON.parse(JSON.stringify(pandit))} />
        </div>
    );
}
