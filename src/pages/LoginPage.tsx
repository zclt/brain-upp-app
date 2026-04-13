import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'

export function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Welcome back</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Sign in to access your notes
        </p>
      </div>
      <GoogleSignInButton />
      <p className="text-center text-xs text-muted-foreground">
        Your notes are stored securely in your own cloud account.
      </p>
    </div>
  )
}
