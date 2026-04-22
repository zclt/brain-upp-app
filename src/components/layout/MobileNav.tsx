import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Kanban, ListTodo, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTrashStore } from '@/stores/trashStore'

export function MobileNav() {
  const { t } = useTranslation()
  const trashCount = useTrashStore((s) => s.trashedNotes.length)

  const navItems = [
    { to: '/',       label: t('nav.dashboard'), icon: LayoutDashboard, end: true  },
    { to: '/kanban', label: t('nav.kanban'),    icon: Kanban,          end: false },
    { to: '/todo',   label: t('nav.todo'),      icon: ListTodo,        end: false },
    { to: '/trash',  label: t('nav.trash'),     icon: Trash2,          end: false },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-background border-t flex lg:hidden">
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors relative',
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
            )
          }
        >
          <span className="relative">
            <Icon className="w-5 h-5" />
            {to === '/trash' && trashCount > 0 && (
              <span className="absolute -top-1 -right-1.5 text-[9px] bg-muted text-muted-foreground rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">
                {trashCount > 9 ? '9+' : trashCount}
              </span>
            )}
          </span>
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
