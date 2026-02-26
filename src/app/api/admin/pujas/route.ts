import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PujaRepository } from "@/repositories/puja.repository";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;
    const category = searchParams.get("category") || undefined;

    const repo = new PujaRepository();
    const result = await repo.list(
      { search, status: status as any, category },
      { page, limit }
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch pujas" }, { status: 500 });
  }
}
