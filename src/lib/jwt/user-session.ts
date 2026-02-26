import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || process.env.AUTH_SECRET || "fallback-secret-min-32-chars"
);
const COOKIE_NAME = "smartpandit_user";
const MAX_AGE_DAYS = parseInt(process.env.JWT_EXPIRES_IN_DAYS || "30", 10);

export interface UserSessionPayload {
  userId: string;
  phone: string;
  iat?: number;
  exp?: number;
}

export async function createUserSession(userId: string, phone: string): Promise<string> {
  const token = await new SignJWT({ userId, phone })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_DAYS}d`)
    .sign(JWT_SECRET);
  return token;
}

export async function verifyUserSession(token: string): Promise<UserSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as UserSessionPayload;
  } catch {
    return null;
  }
}

export async function setUserCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE_DAYS * 24 * 60 * 60,
    path: "/",
  });
}

export async function getUserFromCookie(): Promise<UserSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyUserSession(token);
}

export async function clearUserCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
