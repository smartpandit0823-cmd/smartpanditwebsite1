import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db/mongodb";
import AdminUser from "@/models/AdminUser";

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();
          const email = (credentials.email as string).trim().toLowerCase();
          const admin = await AdminUser.findOne({
            email,
            isActive: true,
          }).select("+password");

          if (!admin) return null;

          const isValid = await bcrypt.compare(
            credentials.password as string,
            admin.password
          );
          if (!isValid) return null;

          if (!admin.role) {
            console.error(`[Auth] Admin user "${email}" is missing a role. Assign a valid role before logging in.`);
            return null;
          }

          await AdminUser.findByIdAndUpdate(admin._id, { lastLogin: new Date() });

          return {
            id: admin._id.toString(),
            name: admin.name,
            email: admin.email,
            role: admin.role,
            image: admin.avatar,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? token.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.AUTH_SECRET,
};
