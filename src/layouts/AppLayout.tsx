import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { MobileNav } from '@/components/layout/MobileNav'
import { NoteModal } from '@/components/notes/NoteModal'
import { useNotes } from '@/hooks/useNotes'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/stores/uiStore'

function DesktopNewButton() {
  const openModal = useUIStore((s) => s.openModal)
  return (
    <Button onClick={() => openModal()} className="gap-2 hidden lg:flex">
      <Plus className="w-4 h-4" />
      New Note
    </Button>
  )
}

export function AppLayout() {
  useNotes()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop top bar */}
        <div className="hidden lg:flex h-16 border-b bg-white items-center px-6 shrink-0 gap-4">
          <div className="flex-1" />
          <DesktopNewButton />
        </div>

        {/* Mobile top bar */}
        <TopBar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />

      {/* Global note modal */}
      <NoteModal />
    </div>
  )
}
