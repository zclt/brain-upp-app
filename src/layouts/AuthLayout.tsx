import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { Brain } from 'lucide-react'

export function AuthLayout() {
  const { user, isLoading } = useAuthStore()

  if (isLoading) {
    return null
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-[#0d1020] dark:via-[#111526] dark:to-[#0d1020] p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Brain-Upp</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Organize your thoughts, studies, and research
          </p>
        </div>
        <div className="bg-card rounded-2xl shadow-xl border p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
