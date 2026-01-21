import { Button } from '@/shared/ui/button'
import { signIn } from 'next-auth/react'

export const GithubLoginButton = () => {
  const handleLogin = async () => {
    await signIn('github', { redirect: true, redirectTo: '/settings' })
  }

  return (
    <Button onClick={handleLogin} variant="outline" type="button">
      Login with Github
    </Button>
  )
}
