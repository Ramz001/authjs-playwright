import NextAuth from 'next-auth'
import { authConfig } from './features/auth'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
})
