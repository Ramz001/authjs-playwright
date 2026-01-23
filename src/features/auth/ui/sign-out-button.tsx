'use client'
import { Button } from '@/shared/ui/button'
import { signOut } from 'next-auth/react'

export function SignOutButton() {
  const handleClick = async () => {
    await signOut({
      redirect: false,
    })
  }

  return (
    <Button onClick={handleClick} variant={'destructive'}>
      Sign Out
    </Button>
  )
}
