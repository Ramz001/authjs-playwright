'use server'

import { auth } from '@/features/auth/server'
import prisma from '@/shared/lib/prisma'
import {
  withActionErrorHandler,
  type ActionResponse,
} from '@/shared/helpers/with-action-error-handler'
import {
  EditProfileSchema,
  type EditProfileSchemaType,
} from '../models/profile.schema'
import type { Session } from 'next-auth'

export const editProfileAction = async (
  values: EditProfileSchemaType
): Promise<ActionResponse<Session['user']>> =>
  withActionErrorHandler(async () => {
    const session = await auth()

    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    const { name, email } = await EditProfileSchema.parseAsync(values)

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
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
