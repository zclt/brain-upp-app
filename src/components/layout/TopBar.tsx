import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Menu, Plus, ChevronDown, FileText, Zap } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './ThemeToggle'
import { LanguageSelector } from './LanguageSelector'
import { QuickNote } from '@/components/notes/QuickNote'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

export function TopBar() {
  const { t } = useTranslation()
  const { setSidebarOpen, openModal } = useUIStore()
  const [quickNoteOpen, setQuickNoteOpen] = useState(false)

  return (
    <>
      <header className="h-16 border-b bg-background flex items-center px-4 gap-3 shrink-0 lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-md hover:bg-accent"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex-1" />
        <LanguageSelector />
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="w-4 h-4" />
              {t('common.newNote')}
              <ChevronDown className="w-3 h-3 opacity-70" />
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
      </header>

      <QuickNote open={quickNoteOpen} onClose={() => setQuickNoteOpen(false)} />
    </>
  )
}
