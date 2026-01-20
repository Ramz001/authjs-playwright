import { SignInForm } from "@/features/auth/ui/sign-in-form";

export default function SignInPage() {
  return (
    <div className="w-full flex flex-col justify-center items-center max-w-lg space-y-6">
      <header className="space-y-1 text-center">
        <h1 className="text-3xl font-semibold text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in with your email and password to continue.
        </p>
      </header>

      <SignInForm />
    </div>
  );
}
