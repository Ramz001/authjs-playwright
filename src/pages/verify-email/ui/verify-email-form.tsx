'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardFooter } from '@shared/ui/card'
import { Button } from '@shared/ui/button'
import { Send } from 'lucide-react'

export function VerifyEmailForm() {
  const { data: session } = useSession()

  const handleSendVerification = async () => {
    // TODO: Implement send verification email action
    console.log('Sending verification email to:', session?.user?.email)
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="space-y-4">
        <div className="bg-muted rounded-lg p-4">
          <p className="text-muted-foreground mb-1 text-sm">Email address</p>
          <p className="font-medium">{session?.user?.email}</p>
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm">
            We&apos;ll send a verification link to your email address. Click the
            link in the email to verify your account.
          </p>
          <p className="text-muted-foreground text-sm">
            If you don&apos;t see the email, please check your spam folder.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSendVerification} className="w-full">
          <Send className="mr-2 h-4 w-4" />
          Send Verification Email
        </Button>
      </CardFooter>
    </Card>
  )
}
