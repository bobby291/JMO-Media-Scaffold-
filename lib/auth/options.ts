import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/db/prisma";
import { hasDatabaseUrl } from "@/lib/env";
import { loginSchema } from "@/lib/validation/auth";

export const authOptions: NextAuthOptions = {
  secret:
    process.env.NEXTAUTH_SECRET ??
    (process.env.NODE_ENV !== "production"
      ? "dev-only-jmo-media-nextauth-secret"
      : undefined),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success || !hasDatabaseUrl()) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          emailVerified: user.emailVerified?.toISOString() ?? null,
        };
      },
    }),
  ],
  callbacks: {
    signIn({ user }) {
      if ("emailVerified" in user && !user.emailVerified && user.email) {
        return `/verify-email?email=${encodeURIComponent(user.email)}`;
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.emailVerified =
          "emailVerified" in user
            ? typeof user.emailVerified === "string"
              ? user.emailVerified
              : user.emailVerified instanceof Date
                ? user.emailVerified.toISOString()
                : null
            : null;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.emailVerified = token.emailVerified;
      }

      return session;
    },
  },
};
