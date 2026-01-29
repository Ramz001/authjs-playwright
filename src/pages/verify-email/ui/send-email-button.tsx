'use client'
import { Button } from '@shared/ui/button'
import { Send } from 'lucide-react'
import {
  SendEmailSchema,
  type SendEmailType,
} from '../models/send-email.schema'
import { handleError } from '@shared/utils/handle-error'
import { useTransition } from 'react'
import { sendEmailOTPAction } from '../api/send-email-otp.action'
import { isSuccess } from '@shared/api/server-error-handlers'

export default function SendEmailButton({ email, name }: SendEmailType) {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      try {
        const validated = SendEmailSchema.parse({ email, name })

        const res = await sendEmailOTPAction(validated)

        if (!isSuccess(res)) {
          throw new Error(
            res?.error?.message || 'Failed to send verification email'
          )
        }
      } catch (error) {
        handleError(error)
      }
    })
  }

  return (
    <Button className="w-full" onClick={handleClick} disabled={isPending}>
      <Send className="mr-2 h-4 w-4" />
      Send Verification Email
    </Button>
  )
}
