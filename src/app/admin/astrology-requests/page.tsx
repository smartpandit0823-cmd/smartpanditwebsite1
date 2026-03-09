import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import AstrologyRequest from "@/models/AstrologyRequest";
import { redirect } from "next/navigation";
import { AstrologyClient } from "./AstrologyClient";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Astrology Requests | Admin",
};

export default async function AdminAstrologyRequestsPage() {
    const session = await auth();
    if (!session?.user) redirect("/admin/login");

    await connectDB();

    const requests = await AstrologyRequest.find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();

    const total = await AstrologyRequest.countDocuments();
    const pending = await AstrologyRequest.countDocuments({ status: "requested" });

    const data = requests.map((r) => ({
        _id: r._id.toString(),
        name: r.name,
        email: r.email,
        phone: r.phone,
        problemCategory: r.problemCategory,
        birthDate: r.birthDate.toISOString(),
        birthTime: r.birthTime || "",
        birthPlace: r.birthPlace,
        status: r.status,
        notes: r.notes || "",
        createdAt: r.createdAt.toISOString(),
    }));

    return <AstrologyClient requests={data} total={total} pending={pending} />;
}
