'use server'

import prisma from '@/shared/lib/prisma'
import {
  withActionErrorHandler,
  type ActionResponse,
} from '@/shared/server/with-action-error-handler'
import { requireAdmin } from '@features/auth/server'
import {
  GetUserSessionsSchema,
  type GetUserSessionsSchemaType,
  RevokeSessionSchema,
  type RevokeSessionSchemaType,
  RevokeAllSessionsSchema,
  type RevokeAllSessionsSchemaType,
} from '../schemas/user-management.schema'
import type { UserSession } from '../types/user-management.types'

/**
 * Get all sessions for a specific user (Admin only)
 */
export const getUserSessionsAction = async (
  values: GetUserSessionsSchemaType
): Promise<ActionResponse<UserSession[]>> =>
  withActionErrorHandler(async () => {
    await requireAdmin()

    const { userId } = await GetUserSessionsSchema.parseAsync(values)

    const sessions = await prisma.session.findMany({
      where: { userId },
      select: {
        sessionToken: true,
        expires: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, data: sessions }
  })

/**
 * Revoke a specific session by token (Admin only)
 */
export const revokeSessionAction = async (
  values: RevokeSessionSchemaType
): Promise<ActionResponse<{ revoked: boolean }>> =>
  withActionErrorHandler(async () => {
    await requireAdmin()

    const { sessionToken } = await RevokeSessionSchema.parseAsync(values)

    await prisma.session.delete({
      where: { sessionToken },
    })

    return { success: true, data: { revoked: true } }
  })

/**
 * Revoke all sessions for a specific user (Admin only)
 */
export const revokeAllUserSessionsAction = async (
  values: RevokeAllSessionsSchemaType
): Promise<ActionResponse<{ revokedCount: number }>> =>
  withActionErrorHandler(async () => {
    await requireAdmin()

    const { userId } = await RevokeAllSessionsSchema.parseAsync(values)

    const result = await prisma.session.deleteMany({
      where: { userId },
    })

    return { success: true, data: { revokedCount: result.count } }
  })
