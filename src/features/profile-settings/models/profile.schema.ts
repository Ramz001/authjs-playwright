import z from 'zod'
import { email, name, role } from '@shared/models/primitive.schema'

export const EditProfileSchema = z.object({
  name,
  email,
})

export const UpdateRoleSchema = z.object({
  email,
  role,
})

export type EditProfileSchemaType = z.infer<typeof EditProfileSchema>
export type UpdateRoleSchemaType = z.infer<typeof UpdateRoleSchema>
