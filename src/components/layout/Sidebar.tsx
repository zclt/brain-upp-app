import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { Brain, LayoutDashboard, Kanban, ListTodo, Trash2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'
import { useTrashStore } from '@/stores/trashStore'
import { UserMenu } from './UserMenu'

export function Sidebar() {
  const { t } = useTranslation()
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const trashCount = useTrashStore((s) => s.trashedNotes.length)

  const navItems = [
    { to: '/',       label: t('nav.dashboard'), icon: LayoutDashboard, end: true,  badge: 0 },
    { to: '/kanban', label: t('nav.kanban'),    icon: Kanban,          end: false, badge: 0 },
    { to: '/todo',   label: t('nav.todo'),      icon: ListTodo,        end: false, badge: 0 },
    { to: '/trash',  label: t('nav.trash'),     icon: Trash2,          end: false, badge: trashCount },
  ]

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={cn(
          'fixed top-0 left-0 z-30 h-full w-60 bg-background border-r flex flex-col transition-transform duration-200 ease-in-out',
          'lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-lg">Brain-Upp</span>
          </div>
          <button
            className="lg:hidden p-1 rounded-md hover:bg-accent"
            onClick={() => setSidebarOpen(false)}
            aria-label={t('common.closeSidebar')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="flex-1">{label}</span>
              {badge > 0 && (
                <span className="ml-auto text-xs bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center leading-none">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t shrink-0">
          <UserMenu />
        </div>
      </aside>
    </>
  )
}
