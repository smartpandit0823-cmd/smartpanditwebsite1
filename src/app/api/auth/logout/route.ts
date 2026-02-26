import { NextResponse } from "next/server";
import { clearUserCookie } from "@/lib/jwt/user-session";

export async function POST() {
  await clearUserCookie();
  return NextResponse.json({ success: true });
}
