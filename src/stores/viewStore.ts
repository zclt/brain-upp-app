import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ViewMode = 'list' | 'columns'
export type ViewPage = 'dashboard' | 'todo'

interface ViewState {
  views: Record<ViewPage, ViewMode>
  setView: (page: ViewPage, view: ViewMode) => void
}

// List/columns choice per page, persisted in localStorage
export const useViewStore = create<ViewState>()(
  persist(
    (set) => ({
      views: { dashboard: 'list', todo: 'list' },
      setView: (page, view) => set((s) => ({ views: { ...s.views, [page]: view } })),
    }),
    { name: 'brain-upp-view-mode' },
  ),
)
