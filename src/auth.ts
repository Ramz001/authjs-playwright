import NextAuth from 'next-auth'
import { authConfig } from './features/auth/server'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig)
