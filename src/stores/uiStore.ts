import { create } from 'zustand'
import type { Note } from '@/types/note'

interface UIState {
  sidebarOpen: boolean
  modalOpen: boolean
  editingNote: Note | null
  setSidebarOpen: (open: boolean) => void
  openModal: (note?: Note) => void
  closeModal: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  modalOpen: false,
  editingNote: null,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  openModal: (note) => set({ modalOpen: true, editingNote: note ?? null }),
  closeModal: () => set({ modalOpen: false, editingNote: null }),
}))
