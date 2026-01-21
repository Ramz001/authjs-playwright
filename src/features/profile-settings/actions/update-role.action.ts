'use server'

import { auth } from '@/features/auth/server'
import prisma from '@/shared/lib/prisma'
import {
  withActionErrorHandler,
  type ActionResponse,
} from '@/shared/helpers/with-action-error-handler'
import { Role } from '@/shared/generated/prisma/enums'
import {
  UpdateRoleSchema,
  type UpdateRoleSchemaType,
} from '../models/profile.schema'
import type { Session } from 'next-auth'

export const updateUserRoleAction = async (
  values: UpdateRoleSchemaType
): Promise<ActionResponse<Session['user']>> =>
  withActionErrorHandler(async () => {
    const session = await auth()

    // Check if user is admin
    if (!session?.user?.id || session.user.role !== Role.ADMIN) {
      throw new Error('Unauthorized - Admin access required')
    }

    const { email, role } = await UpdateRoleSchema.parseAsync(values)

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: role as Role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    return { success: true, data: updatedUser }
  })
