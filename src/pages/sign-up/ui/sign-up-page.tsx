import { SignUpForm } from '@/features/auth/ui/sign-up-form'

export default function SignUpPage() {
  return (
    <div className="w-full flex flex-col justify-center items-center max-w-lg space-y-6">
      <header className="space-y-1 text-center">
        <h1 className="text-3xl font-semibold text-foreground">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Sign up with your email and a secure password to get started.
        </p>
      </header>

      <SignUpForm />
    </div>
  )
}
