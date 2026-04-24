import { useEffect } from 'react'
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
import { Plus, ChevronDown, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/stores/uiStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function DesktopNewButton() {
  const { t } = useTranslation()
  const openModal = useUIStore((s) => s.openModal)
  const openQuickNote = useUIStore((s) => s.openQuickNote)

  return (
    <div className="hidden lg:flex items-stretch">
      {/* Main action: opens full modal */}
      <Button
        onClick={() => openModal()}
        className="gap-2 rounded-r-none border-r border-primary-foreground/20"
      >
        <Plus className="w-4 h-4" />
        {t('common.newNote')}
      </Button>

      {/* Chevron: opens dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-l-none px-2">
            <ChevronDown className="w-3.5 h-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onClick={() => openQuickNote()}
            className="cursor-pointer gap-2"
          >
            <Zap className="w-4 h-4" />
            {t('quickNote.label')}
            <span className="ml-auto text-xs opacity-50">N</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function AppLayout() {
  useNotes()
  useTrash()
  useTaskNotifications()

  const quickNoteOpen = useUIStore((s) => s.quickNoteOpen)
  const openQuickNote = useUIStore((s) => s.openQuickNote)
  const closeQuickNote = useUIStore((s) => s.closeQuickNote)
  const modalOpen = useUIStore((s) => s.modalOpen)

  // Global shortcut: N opens Quick Note (when not typing in an input)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'n' && e.key !== 'N') return
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const target = e.target as HTMLElement
      const tag = target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return
      if (modalOpen || quickNoteOpen) return
      e.preventDefault()
      openQuickNote()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [modalOpen, quickNoteOpen, openQuickNote])

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

      {/* Global quick note */}
      <QuickNote open={quickNoteOpen} onClose={closeQuickNote} />
    </div>
  )
}
