import { Role } from '@shared/generated/prisma/enums'
import z from 'zod'

export const password = z.string().min(6)
export const email = z.email()
export const name = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be at most 50 characters')
export const role = z.enum(Role)

export type RoleType = z.infer<typeof role>
