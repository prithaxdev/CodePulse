import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      {/* forceRedirectUrl overrides Clerk Dashboard redirect settings — guarantees
          new users always land on onboarding regardless of dashboard config. */}
      <SignUp forceRedirectUrl="/onboarding" />
    </div>
  )
}
