import { SignInForm } from '@/features/auth/client'

export default function SignInPage() {
  return (
    <div className="flex w-full max-w-lg flex-col items-center justify-center space-y-6">
      <header className="space-y-1 text-center">
        <h1 className="text-foreground text-3xl font-semibold">Welcome back</h1>
        <p className="text-muted-foreground text-sm">
          Sign in with your email and password to continue.
        </p>
      </header>

      <SignInForm />
    </div>
  )
}
