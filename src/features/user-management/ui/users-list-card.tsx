'use client'

import { useState, useEffect, useTransition, useCallback } from 'react'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog'
import { Spinner } from '@/shared/ui/spinner'
import { handleError } from '@shared/client/handle-error'
import type { UserListItem } from '../types/user-management.types'
import {
  getAllUsersAction,
  deleteUserAction,
} from '../actions/user-data.action'

interface UsersListCardProps {
  onSelectUser?: (userId: string) => void
  selectedUserId?: string | null
}

export function UsersListCard({
  onSelectUser,
  selectedUserId,
}: UsersListCardProps) {
  const [users, setUsers] = useState<UserListItem[]>([])
  const [isPending, startTransition] = useTransition()
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUsers = useCallback(() => {
    startTransition(async () => {
      try {
        const result = await getAllUsersAction()

        if (!result.success) {
          toast.error(result.error || 'Failed to fetch users')
          return
        }

        setUsers(result.data)
      } catch (error) {
        handleError(error)
      } finally {
        setIsLoading(false)
      }
    })
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleDeleteUser = async (userId: string) => {
    setDeletingUserId(userId)
    startTransition(async () => {
      try {
        const result = await deleteUserAction({ userId })

        if (!result.success) {
          toast.error(result.error || 'Failed to delete user')
          return
        }

        toast.success('User deleted successfully')
        fetchUsers()
        if (selectedUserId === userId) {
          onSelectUser?.(null as unknown as string)
        }
      } catch (error) {
        handleError(error)
      } finally {
        setDeletingUserId(null)
      }
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Spinner />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage all registered users ({users.length} total)
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            disabled={isPending}
          >
            {isPending ? <Spinner /> : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <p className="text-muted-foreground text-sm">No users found</p>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                  selectedUserId === user.id
                    ? 'border-primary bg-primary/5'
                    : 'hover:bg-muted/50'
                }`}
              >
                <button
                  type="button"
                  className="flex flex-1 items-center gap-3 text-left"
                  onClick={() => onSelectUser?.(user.id)}
                >
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt={user.name || 'User avatar'}
                      className="size-10 rounded-full"
                    />
                  ) : (
                    <div className="bg-muted flex size-10 items-center justify-center rounded-full">
                      <span className="text-muted-foreground text-sm font-medium">
                        {user.name?.charAt(0)?.toUpperCase() ||
                          user.email?.charAt(0)?.toUpperCase() ||
                          '?'}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">
                        {user.name || 'Unnamed User'}
                      </p>
                      <Badge
                        variant={
                          user.role === 'ADMIN' ? 'default' : 'secondary'
                        }
                      >
                        {user.role}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground truncate text-xs">
                      {user.email}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {user._count.sessions} active session(s)
                    </p>
                  </div>
                </button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isPending}
                    >
                      {deletingUserId === user.id ? <Spinner /> : 'Delete'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete User?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete {user.name || user.email}{' '}
                        and all their data including sessions and accounts. This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete User
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
