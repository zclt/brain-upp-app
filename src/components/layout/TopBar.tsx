import { useTranslation } from 'react-i18next'
import { Menu, Plus, ChevronDown, Zap } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './ThemeToggle'
import { LanguageSelector } from './LanguageSelector'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function TopBar() {
  const { t } = useTranslation()
  const { setSidebarOpen, openModal, openQuickNote } = useUIStore()

  return (
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

      {/* Split button */}
      <div className="flex items-stretch">
        {/* Main action: opens full modal */}
        <Button
          size="sm"
          onClick={() => openModal()}
          className="gap-1.5 rounded-r-none border-r border-primary-foreground/20"
        >
          <Plus className="w-4 h-4" />
          {t('common.newNote')}
        </Button>

        {/* Chevron: opens dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="rounded-l-none px-2">
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
    </header>
  )
}
