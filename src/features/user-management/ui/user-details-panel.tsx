'use client'

import { useState, useEffect, useTransition, useCallback } from 'react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Badge } from '@/shared/ui/badge'
import { Separator } from '@/shared/ui/separator'
import { Spinner } from '@/shared/ui/spinner'
import { handleError } from '@shared/client/handle-error'
import type { UserFullData } from '../types/user-management.types'
import { getUserFullDataAction } from '../actions/user-data.action'
import { SessionManagementCard } from './session-management-card'

interface UserDetailsPanelProps {
  userId: string
  onClose?: () => void
}

export function UserDetailsPanel({ userId, onClose }: UserDetailsPanelProps) {
  const [user, setUser] = useState<UserFullData | null>(null)
  const [isPending, startTransition] = useTransition()

  const fetchUserData = useCallback(() => {
    startTransition(async () => {
      try {
        const result = await getUserFullDataAction({ userId })

        if (!result.success) {
          toast.error(result.error || 'Failed to fetch user data')
          return
        }

        setUser(result.data)
      } catch (error) {
        handleError(error)
      }
    })
  }, [userId])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  if (isPending && !user) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Spinner />
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">User not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name || 'User avatar'}
                  className="size-16 rounded-full"
                />
              ) : (
                <div className="bg-muted flex size-16 items-center justify-center rounded-full">
                  <span className="text-muted-foreground text-2xl font-medium">
                    {user.name?.charAt(0)?.toUpperCase() ||
                      user.email?.charAt(0)?.toUpperCase() ||
                      '?'}
                  </span>
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>{user.name || 'Unnamed User'}</CardTitle>
                  <Badge
                    variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                  >
                    {user.role}
                  </Badge>
                </div>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchUserData}
                disabled={isPending}
              >
                {isPending ? <Spinner /> : 'Refresh'}
              </Button>
              {onClose && (
                <Button variant="ghost" size="sm" onClick={onClose}>
                  Close
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 text-sm font-medium">User Information</h4>
              <dl className="grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">User ID</dt>
                  <dd className="font-mono text-xs">{user.id}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Email Verified</dt>
                  <dd>
                    {user.emailVerified ? (
                      <Badge variant="secondary">
                        {format(new Date(user.emailVerified), 'MMM d, yyyy')}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not verified</Badge>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Created</dt>
                  <dd>
                    {format(new Date(user.createdAt), 'MMM d, yyyy HH:mm')}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Last Updated</dt>
                  <dd>
                    {format(new Date(user.updatedAt), 'MMM d, yyyy HH:mm')}
                  </dd>
                </div>
              </dl>
            </div>

            <Separator />

            <div>
              <h4 className="mb-2 text-sm font-medium">
                Linked Accounts ({user._count.accounts})
              </h4>
              {user.accounts.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No linked accounts (using credentials)
                </p>
              ) : (
                <div className="space-y-2">
                  {user.accounts.map((account) => (
                    <div
                      key={`${account.provider}-${account.providerAccountId}`}
                      className="flex items-center justify-between rounded-lg border p-2"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{account.provider}</Badge>
                        <span className="text-muted-foreground text-xs">
                          {account.type}
                        </span>
                      </div>
                      <span className="text-muted-foreground font-mono text-xs">
                        ID: {account.providerAccountId.slice(0, 8)}...
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <SessionManagementCard
        userId={user.id}
        userName={user.name}
        sessions={user.sessions}
        onSessionRevoked={fetchUserData}
      />
    </div>
  )
}
