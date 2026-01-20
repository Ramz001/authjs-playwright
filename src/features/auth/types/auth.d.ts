import { Role } from '@/shared/generated/prisma/enums'
import { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string
    role?: Role
  }

  interface Session {
    user: {
      id: string
      role: Role
    } & DefaultSession['user']
  }
}
