'use server'

import prisma from '@shared/lib/prisma'
import bcrypt from 'bcryptjs'
import { withActionErrorHandler } from '@shared/api/with-action-error-handler'
import { SignUpSchema, type SignUpSchemaType } from '@shared/models/auth.schema'

export const signUpAction = async (values: SignUpSchemaType) =>
  withActionErrorHandler(async () => {
    const { email, password, name } = await SignUpSchema.parseAsync(values)

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        updatedAt: new Date(),
      },
    })

    return { success: true, data: null }
  })
