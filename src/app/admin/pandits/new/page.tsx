import { auth } from "@/auth";
import { PanditForm } from "../PanditForm";

export default async function NewPanditPage() {
    await auth();
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-heading text-3xl font-bold">Add Pandit</h1>
                <p className="mt-1 text-gray-600">Create a new pandit profile for your team</p>
            </div>
            <PanditForm />
        </div>
    );
}
