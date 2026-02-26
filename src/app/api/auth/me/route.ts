import { NextResponse } from "next/server";
import { getUserFromCookie } from "@/lib/jwt/user-session";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";

export async function GET() {
  const session = await getUserFromCookie();
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  await connectDB();
  const user = await User.findById(session.userId).lean();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({
    user: {
      id: user._id.toString(),
      phone: user.phone,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      city: user.city,
    },
  });
}
