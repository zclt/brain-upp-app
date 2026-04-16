import { useTranslation } from 'react-i18next'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'

export function LoginPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">{t('auth.welcomeBack')}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t('auth.signInSubtitle')}</p>
      </div>
      <GoogleSignInButton />
      <p className="text-center text-xs text-muted-foreground">{t('auth.secureStorage')}</p>
    </div>
  )
}
