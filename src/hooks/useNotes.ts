import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useNotesStore } from '@/stores/notesStore'
import { subscribeToNotes } from '@/services/notes.service'

export function useNotes() {
  const user = useAuthStore((s) => s.user)
  const setNotes = useNotesStore((s) => s.setNotes)
  const setLoading = useNotesStore((s) => s.setLoading)

  useEffect(() => {
    if (!user) {
      setNotes([])
      return
    }

    setLoading(true)
    const unsubscribe = subscribeToNotes(user.uid, (notes) => {
      setNotes(notes)
    })

    return unsubscribe
  }, [user, setNotes, setLoading])
}
