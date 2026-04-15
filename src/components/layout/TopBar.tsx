import { Menu, Plus } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './ThemeToggle'
import { LanguageSelector } from './LanguageSelector'

export function TopBar() {
  const { setSidebarOpen, openModal } = useUIStore()

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
      <Button size="sm" onClick={() => openModal()} className="gap-1.5">
        <Plus className="w-4 h-4" />
        New Note
      </Button>
    </header>
  )
}
