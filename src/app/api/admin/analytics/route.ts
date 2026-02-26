import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDashboardStats } from "@/services/analytics.service";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const period = (searchParams.get("period") || "7d") as "7d" | "30d";
    const stats = await getDashboardStats(period);
    return NextResponse.json(stats);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
