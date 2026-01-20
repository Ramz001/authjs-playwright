import z from 'zod'

const password = z.string().min(6)
const email = z.email()

export const LoginSchema = z.object({
  email,
  password,
})

export const SignUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be at most 50 characters'),
    email,
    password,
    confirmPassword: password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
  })

export type LoginSchemaType = z.infer<typeof LoginSchema>
export type SignUpSchemaType = z.infer<typeof SignUpSchema>
