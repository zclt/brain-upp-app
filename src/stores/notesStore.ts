import { create } from 'zustand'
import type { Note } from '@/types/note'

interface NotesState {
  notes: Note[]
  isLoading: boolean
  setNotes: (notes: Note[]) => void
  setLoading: (isLoading: boolean) => void
  addNote: (note: Note) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  removeNote: (id: string) => void
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  isLoading: true,
  setNotes: (notes) => set({ notes, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
  updateNote: (id, updates) =>
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    })),
  removeNote: (id) =>
    set((state) => ({ notes: state.notes.filter((n) => n.id !== id) })),
}))
