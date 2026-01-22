'use server'

import prisma from '@/shared/lib/prisma'
import {
  withActionErrorHandler,
  type ActionResponse,
} from '@/shared/server/with-action-error-handler'
import { requireAdmin } from '@features/auth/server'
import {
  GetUserByIdSchema,
  type GetUserByIdSchemaType,
  DeleteUserSchema,
  type DeleteUserSchemaType,
} from '../schemas/user-management.schema'
import type { UserFullData, UserListItem } from '../types/user-management.types'

/**
 * Get all users with basic info (Admin only)
 */
export const getAllUsersAction = async (): Promise<
  ActionResponse<UserListItem[]>
> =>
  withActionErrorHandler(async () => {
    await requireAdmin()

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            Session: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Transform to match our type
    const transformedUsers: UserListItem[] = users.map((user) => ({
      ...user,
      _count: {
        sessions: user._count.Session,
      },
    }))

    return { success: true, data: transformedUsers }
  })

/**
 * Get full user data including sessions and accounts (Admin only)
 */
export const getUserFullDataAction = async (
  values: GetUserByIdSchemaType
): Promise<ActionResponse<UserFullData>> =>
  withActionErrorHandler(async () => {
    await requireAdmin()

    const { userId } = await GetUserByIdSchema.parseAsync(values)

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        Session: {
          select: {
            sessionToken: true,
            expires: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        Account: {
          select: {
            provider: true,
            providerAccountId: true,
            type: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        _count: {
          select: {
            Session: true,
            Account: true,
          },
        },
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    // Transform to match our type
    const transformedUser: UserFullData = {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      sessions: user.Session,
      accounts: user.Account,
      _count: {
        sessions: user._count.Session,
        accounts: user._count.Account,
      },
    }

    return { success: true, data: transformedUser }
  })

/**
 * Delete a user and all their data (Admin only)
 */
export const deleteUserAction = async (
  values: DeleteUserSchemaType
): Promise<ActionResponse<{ deleted: boolean }>> =>
  withActionErrorHandler(async () => {
    const admin = await requireAdmin()

    const { userId } = await DeleteUserSchema.parseAsync(values)

    // Prevent admin from deleting themselves
    if (admin.id === userId) {
      throw new Error('Cannot delete your own account')
    }

    // Delete user (cascade will handle sessions and accounts)
    await prisma.user.delete({
      where: { id: userId },
    })

    return { success: true, data: { deleted: true } }
  })
