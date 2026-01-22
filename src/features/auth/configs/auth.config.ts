import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from '@/shared/lib/prisma'
import { LoginSchema } from '../schemas/auth.schema'
import GithubProvider from 'next-auth/providers/github'
import { NextAuthConfig } from 'next-auth'
import { Role } from '@/shared/generated/prisma/enums'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { checkRouteAccess } from '../lib/check-route-access'

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'database',
  },
  pages: {
    signIn: '/auth/sign-in',
    newUser: '/auth/sign-up',
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const validated = LoginSchema.safeParse(credentials)

          if (!validated.success) {
            console.warn(validated.error.issues, 'Invalid credentials input:')
            return null
          }

          const { email, password } = validated.data

          const user = await prisma.user.findFirst({
            where: { email },
          })

          if (!user?.password) return null

          const passwordsMatch = await bcrypt.compare(password, user.password)
          if (!passwordsMatch) return null

          return user
        } catch (error) {
          console.error(error, 'Unexpected error in authorize:')
          return null
        }
      },
    }),
  ],
  callbacks: {
    authorized({ request: { nextUrl }, auth }) {
      const { pathname } = nextUrl

      const routeAccess = checkRouteAccess(pathname, auth?.user)

      if (routeAccess.success) {
        return true
      }

      if (routeAccess.reason === 'unauthenticated') {
        return Response.redirect(new URL('/auth/sign-in', nextUrl))
      }

      if (routeAccess.reason === 'unauthorized') {
        return Response.redirect(new URL('/', nextUrl))
      }
      return false
    },
    // With database sessions, we receive user directly from DB
    async session({ session, user }) {
      if (user) {
        session.user.id = user.id
        session.user.role = user.role as Role
      }
      return session
    },
  },
} satisfies NextAuthConfig
