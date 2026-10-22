import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type DashboardView = 'list' | 'columns'

interface DashboardState {
  view: DashboardView
  setView: (view: DashboardView) => void
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      view: 'list',
      setView: (view) => set({ view }),
    }),
    { name: 'brain-upp-dashboard-view' },
  ),
)
