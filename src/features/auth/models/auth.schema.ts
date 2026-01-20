import z from 'zod'

const password = z.string().min(6)

export const LoginSchema = z.object({
  email: z.email(),
  password,
})
