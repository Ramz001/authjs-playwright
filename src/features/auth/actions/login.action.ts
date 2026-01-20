'use server'

import { LoginSchema, LoginSchemaType } from '../models/auth.schema'
import { signIn } from '../api/auth'
import prisma from '@shared/lib/prisma'
import { withActionErrorHandler } from '@shared/helpers/with-action-error-handler'

const login = async (values: LoginSchemaType) => {
  const { email, password } = LoginSchema.parse(values)

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!existingUser?.id || !existingUser.email || !existingUser.password) {
    throw new Error('Invalid phone or password. Please try again.')
  }

  await signIn('credentials', {
    email,
    password,
    redirect: false,
  })

  return {
    success: true,
  }
}

export const loginAction = withActionErrorHandler(login)
