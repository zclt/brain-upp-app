import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/stores/authStore'
import { LoadingScreen } from '@/components/ui/loading-screen'

function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuth()
  const isLoading = useAuthStore((s) => s.isLoading)

  if (isLoading) return <LoadingScreen />

  return <>{children}</>
}

export default function App() {
  return (
    <AuthInitializer>
      <RouterProvider router={router} />
    </AuthInitializer>
  )
}
