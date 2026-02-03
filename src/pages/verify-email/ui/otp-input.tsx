'use client'

import { Button } from '@shared/ui/button'
import {
  InputOTP,
  InputOTPSlot,
  InputOTPGroup,
  InputOTPSeparator,
} from '@shared/ui/input-otp'
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
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col items-center justify-center space-y-4"
    >
      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
        <InputOTPGroup className="gap-3">
          <InputOTPSlot className="size-12 text-xl font-semibold" index={0} />
          <InputOTPSlot className="size-12 text-xl font-semibold" index={1} />
          <InputOTPSlot className="size-12 text-xl font-semibold" index={2} />
        </InputOTPGroup>
        <InputOTPSeparator className="mx-2" />
        <InputOTPGroup className="gap-3">
          <InputOTPSlot className="size-12 text-xl font-semibold" index={3} />
          <InputOTPSlot className="size-12 text-xl font-semibold" index={4} />
          <InputOTPSlot className="size-12 text-xl font-semibold" index={5} />
        </InputOTPGroup>
      </InputOTP>
      <Button
        type="submit"
        className="h-12 w-full text-base font-semibold"
        disabled={isPending || otp.length !== 6}
      >
        {isPending ? (
          <Spinner className="mr-2 h-5 w-5" />
        ) : (
          <CheckCircle className="mr-2 h-5 w-5" />
        )}
        Verify Email
      </Button>
    </form>
  )
}
