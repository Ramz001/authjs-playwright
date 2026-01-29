'use client'

import { Button } from '@shared/ui/button'
import { InputOTP, InputOTPSlot, InputOTPGroup } from '@shared/ui/input-otp'
import { Label } from '@shared/ui/label'
import { CheckCircle } from 'lucide-react'
import { useState, useTransition } from 'react'
import { handleError } from '@shared/utils/handle-error'
import { confirmEmailOTPAction } from '../api/confirm-email-otp.action'
import { isSuccess } from '@shared/api/server-error-handlers'
import { Spinner } from '@shared/ui/spinner'
import { toast } from 'sonner'
import {
  ConfirmEmailOTPSchema,
  type SendEmailType,
} from '../models/verify-email.schema'

export default function OTPInputSection({ email }: SendEmailType) {
  const [otp, setOtp] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    startTransition(async () => {
      try {
        const validated = ConfirmEmailOTPSchema.parse({ email, otp })

        const res = await confirmEmailOTPAction(validated)

        if (!isSuccess(res)) {
          throw new Error(res?.error?.message || 'Failed to verify OTP')
        }

        toast.success('Email verified successfully!')
      } catch (error) {
        handleError(error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2 w-full ">
        <Label htmlFor="otp">Enter verification code</Label>
        <InputOTP maxLength={6} defaultValue={otp} onChange={setOtp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isPending || otp.length !== 6}
      >
        {isPending ? (
          <Spinner className="mr-2 h-4 w-4" />
        ) : (
          <CheckCircle className="mr-2 h-4 w-4" />
        )}
        Verify Email
      </Button>
    </form>
  )
}
