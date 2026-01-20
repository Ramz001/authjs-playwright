import { SignUpForm } from '@/features/auth/client'

export default function SignUpPage() {
  return (
    <div className="flex w-full max-w-lg flex-col items-center justify-center space-y-6">
      <header className="space-y-1 text-center">
        <h1 className="text-foreground text-3xl font-semibold">
          Create your account
        </h1>
        <p className="text-muted-foreground text-sm">
          Sign up with your email and a secure password to get started.
        </p>
      </header>

      <SignUpForm />
    </div>
  )
}
