'use server'

import prisma from '@/shared/lib/prisma'
import {
  withActionErrorHandler,
  type ActionResponse,
} from '@/shared/server/with-action-error-handler'
import {
  EditProfileSchema,
  type EditProfileSchemaType,
} from '../schemas/profile.schema'
import type { Session } from 'next-auth'
import { requireAuth } from '@shared/server/auth.guard'

export const editProfileAction = async (
  values: EditProfileSchemaType
): Promise<ActionResponse<Session['user']>> =>
  withActionErrorHandler(async () => {
    const user = await requireAuth()

    const { name, email } = await EditProfileSchema.parseAsync(values)

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
    })

    return { success: true, data: updatedUser }
  })
