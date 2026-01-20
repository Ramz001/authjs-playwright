import NextAuth from 'next-auth'
import prisma from './shared/lib/prisma'
import { authConfig } from './features/auth/server'
import { PrismaAdapter } from '@auth/prisma-adapter'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/sign-in',
    newUser: '/auth/sign-up',
  },
  ...authConfig,
})
