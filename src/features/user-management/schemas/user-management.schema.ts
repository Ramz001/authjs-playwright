import { z } from 'zod'

export const GetUserSessionsSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
})

export type GetUserSessionsSchemaType = z.infer<typeof GetUserSessionsSchema>

export const RevokeSessionSchema = z.object({
  sessionToken: z.string().min(1, 'Session token is required'),
})

export type RevokeSessionSchemaType = z.infer<typeof RevokeSessionSchema>

export const RevokeAllSessionsSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
})

export type RevokeAllSessionsSchemaType = z.infer<
  typeof RevokeAllSessionsSchema
>

export const GetUserByIdSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
})

export type GetUserByIdSchemaType = z.infer<typeof GetUserByIdSchema>

export const DeleteUserSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
})

export type DeleteUserSchemaType = z.infer<typeof DeleteUserSchema>
