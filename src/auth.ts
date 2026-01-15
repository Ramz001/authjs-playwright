import NextAuth from "next-auth";
import prisma from "./shared/lib/prisma";
import { authConfig } from "./features/auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  ...authConfig,
});
