import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { MobileNav } from '@/components/layout/MobileNav'
import { NoteModal } from '@/components/notes/NoteModal'
import { QuickNote } from '@/components/notes/QuickNote'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { LanguageSelector } from '@/components/layout/LanguageSelector'
import { useNotes } from '@/hooks/useNotes'
import { useTrash } from '@/hooks/useTrash'
import { useTaskNotifications } from '@/hooks/useTaskNotifications'
import { Plus, ChevronDown, FileText, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/stores/uiStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

function DesktopNewButton() {
  const { t } = useTranslation()
  const openModal = useUIStore((s) => s.openModal)
  const [quickNoteOpen, setQuickNoteOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="gap-2 hidden lg:flex">
            <Plus className="w-4 h-4" />
            {t('common.newNote')}
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onClick={() => openModal()}
            className="cursor-pointer gap-2"
          >
            <FileText className="w-4 h-4" />
            {t('quickNote.newNote')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setQuickNoteOpen(true)}
            className="cursor-pointer gap-2"
          >
            <Zap className="w-4 h-4" />
            {t('quickNote.label')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <QuickNote open={quickNoteOpen} onClose={() => setQuickNoteOpen(false)} />
    </>
  )
}

export function AppLayout() {
  useNotes()
  useTrash()
  useTaskNotifications()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop top bar */}
        <div className="hidden lg:flex h-16 border-b bg-background items-center px-6 shrink-0 gap-4">
          <div className="flex-1" />
          <LanguageSelector />
          <ThemeToggle />
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
