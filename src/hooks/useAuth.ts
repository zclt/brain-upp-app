import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { useAuthStore } from '@/stores/authStore'
import { handleRedirectResult } from '@/services/auth.service'

export function useAuth() {
  const { setUser, setLoading } = useAuthStore()

  useEffect(() => {
    // Handle redirect result first (fires after Google redirect login)
    handleRedirectResult().catch(console.error)

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [setUser, setLoading])
}
