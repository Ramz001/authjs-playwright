import type { Role } from '@/shared/generated/prisma/enums'

export interface UserSession {
  sessionToken: string
  expires: Date
  createdAt: Date
  updatedAt: Date
}

export interface UserAccount {
  provider: string
  providerAccountId: string
  type: string
  createdAt: Date
  updatedAt: Date
}

export interface UserFullData {
  id: string
  name: string | null
  email: string | null
  emailVerified: Date | null
  image: string | null
  role: Role
  createdAt: Date
  updatedAt: Date
  sessions: UserSession[]
  accounts: UserAccount[]
  _count: {
    sessions: number
    accounts: number
  }
}

export interface UserListItem {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: Role
  createdAt: Date
  _count: {
    sessions: number
  }
}
