import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useTrashStore } from '@/stores/trashStore'
import { subscribeToTrash, purgeExpiredTrash } from '@/services/notes.service'

export function useTrash() {
  const user = useAuthStore((s) => s.user)
  const { setTrashedNotes, setLoading } = useTrashStore()

  useEffect(() => {
    if (!user) {
      setTrashedNotes([])
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubscribe = subscribeToTrash(user.uid, (notes) => {
      setTrashedNotes(notes)
      purgeExpiredTrash(user.uid, notes)
    })

    return unsubscribe
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps
}
