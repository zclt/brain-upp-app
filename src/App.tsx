import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'
import { useAuth } from '@/hooks/useAuth'

function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuth()
  return <>{children}</>
}

export default function App() {
  return (
    <AuthInitializer>
      <RouterProvider router={router} />
    </AuthInitializer>
  )
}
