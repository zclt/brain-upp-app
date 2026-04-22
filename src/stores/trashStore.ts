import { create } from 'zustand'
import type { Note } from '@/types/note'

interface TrashState {
  trashedNotes: Note[]
  isLoading: boolean
  setTrashedNotes: (notes: Note[]) => void
  setLoading: (isLoading: boolean) => void
}

export const useTrashStore = create<TrashState>((set) => ({
  trashedNotes: [],
  isLoading: true,
  setTrashedNotes: (trashedNotes) => set({ trashedNotes, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}))
