import { getUserFromCookie } from "@/lib/jwt/user-session";

export async function requireUser() {
  const session = await getUserFromCookie();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
