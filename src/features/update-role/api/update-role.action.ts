'use server'

import prisma from '@/shared/lib/prisma'
import {
  withActionErrorHandler,
  type ActionResponse,
} from '@/shared/api/with-action-error-handler'
import {
  UpdateRoleSchema,
  type UpdateRoleSchemaType,
} from '../models/update-role.schema'
import type { Session } from 'next-auth'
import { requireAdmin } from '@shared/api/auth.guard'

export const updateUserRoleAction = async (
  values: UpdateRoleSchemaType
): Promise<ActionResponse<Session['user']>> =>
  withActionErrorHandler(async () => {
    await requireAdmin()

    const { email, role } = await UpdateRoleSchema.parseAsync(values)

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role },
    })

    return { success: true, data: updatedUser }
  })
