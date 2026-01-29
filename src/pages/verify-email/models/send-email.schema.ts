import z from 'zod'
import { email, name } from '@shared/models/primitive.schema'

export const SendEmailSchema = z.object({
  email,
  name,
})
export type SendEmailType = z.infer<typeof SendEmailSchema>