'use server'

import prisma from '@shared/lib/prisma'
import bcrypt from 'bcryptjs'
import { SignUpSchema, type SignUpSchemaType } from '../models/auth.schema'
import { withActionErrorHandler } from '@shared/helpers/with-action-error-handler'

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
