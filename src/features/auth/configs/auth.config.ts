import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/shared/lib/prisma";
import { LoginSchema } from "../models/auth.schema";
import GithubProvider from "next-auth/providers/github";
import { NextAuthConfig } from "next-auth";
import { Role } from "@/shared/generated/prisma/enums";
import { PROTECTED_ROUTES, ADMIN_ROUTES } from "../consts/auth";

export const authConfig = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const validated = LoginSchema.safeParse(credentials);

          if (!validated.success) {
            console.warn(validated.error.issues, "Invalid credentials input:");
            return null;
          }

          const { email, password } = validated.data;

          const user = await prisma.user.findFirst({
            where: { email },
          });

          if (!user?.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) return null;

          return user;
        } catch (error) {
          console.error(error, "Unexpected error in authorize:");
          return null;
        }
      },
    }),
  ],
  callbacks: {
    authorized({ request: { nextUrl }, auth }) {
      const { pathname } = nextUrl;
      const role = auth?.user?.role;

      const isAuthRoute = PROTECTED_ROUTES.some((route) =>
        pathname.startsWith(route)
      );
      const isAdminRoute = ADMIN_ROUTES.some((route) =>
        pathname.startsWith(route)
      );

      if (auth?.user) {
        if (isAuthRoute) return Response.redirect(new URL("/", nextUrl));
        if (isAdminRoute && role !== Role.ADMIN)
          return Response.redirect(new URL("/", nextUrl));
      }

      // here the user is not logged in
      if (isAuthRoute) return true;

      return !!auth?.user;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as Role;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
} satisfies NextAuthConfig;
