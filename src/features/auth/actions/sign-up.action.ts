'use server'
import prisma from '@shared/lib/prisma'
import { SignUpSchema, type SignUpSchemaType } from '../models/auth.schema'
import bcrypt from 'bcryptjs'
import { loginAction } from './login.action'
import { withActionErrorHandler } from '@shared/helpers/with-action-error-handler'

const register = async (values: SignUpSchemaType) => {
  const { email, password } = await SignUpSchema.parseAsync(values)

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      updatedAt: new Date(),
    },
  })

  return await loginAction({ email, password })
}

export const signUpAction = withActionErrorHandler(register)
