'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
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
import type { UserSession } from '../types/user-management.types'
import {
  revokeSessionAction,
  revokeAllUserSessionsAction,
} from '../actions/session-management.action'

interface SessionManagementCardProps {
  userId: string
  userName: string | null
  sessions: UserSession[]
  onSessionRevoked?: () => void
}

export function SessionManagementCard({
  userId,
  userName,
  sessions,
  onSessionRevoked,
}: SessionManagementCardProps) {
  const [isPending, startTransition] = useTransition()
  const [revokingToken, setRevokingToken] = useState<string | null>(null)

  const handleRevokeSession = async (sessionToken: string) => {
    setRevokingToken(sessionToken)
    startTransition(async () => {
      try {
        const result = await revokeSessionAction({ sessionToken })

        if (!result.success) {
          toast.error(result.error || 'Failed to revoke session')
          return
        }

        toast.success('Session revoked successfully')
        onSessionRevoked?.()
      } catch (error) {
        handleError(error)
      } finally {
        setRevokingToken(null)
      }
    })
  }

  const handleRevokeAllSessions = async () => {
    startTransition(async () => {
      try {
        const result = await revokeAllUserSessionsAction({ userId })

        if (!result.success) {
          toast.error(result.error || 'Failed to revoke sessions')
          return
        }

        toast.success(`${result.data.revokedCount} session(s) revoked`)
        onSessionRevoked?.()
      } catch (error) {
        handleError(error)
      }
    })
  }

  const isSessionExpired = (expires: Date) => new Date(expires) < new Date()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sessions</CardTitle>
            <CardDescription>
              Active sessions for {userName || 'this user'}
            </CardDescription>
          </div>
          {sessions.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isPending}>
                  Revoke All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Revoke All Sessions?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will log out {userName || 'this user'} from all
                    devices. They will need to sign in again.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRevokeAllSessions}>
                    {isPending ? <Spinner /> : 'Revoke All'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <p className="text-muted-foreground text-sm">No active sessions</p>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => {
              const expired = isSessionExpired(session.expires)
              return (
                <div
                  key={session.sessionToken}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        Session created{' '}
                        {formatDistanceToNow(new Date(session.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                      {expired ? (
                        <Badge variant="destructive">Expired</Badge>
                      ) : (
                        <Badge variant="secondary">Active</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Expires:{' '}
                      {new Date(session.expires).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-muted-foreground font-mono text-xs">
                      Token: ...{session.sessionToken.slice(-12)}
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isPending || expired}
                      >
                        {revokingToken === session.sessionToken ? (
                          <Spinner />
                        ) : (
                          'Revoke'
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Revoke Session?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will log out the user from this device. They will
                          need to sign in again.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleRevokeSession(session.sessionToken)
                          }
                        >
                          Revoke
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
