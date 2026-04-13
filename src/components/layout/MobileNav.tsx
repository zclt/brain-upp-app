import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Kanban, ListTodo } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/',       label: 'Dashboard', icon: LayoutDashboard, end: true  },
  { to: '/kanban', label: 'Kanban',    icon: Kanban,          end: false },
  { to: '/todo',   label: 'Todo',      icon: ListTodo,        end: false },
]

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-background border-t flex lg:hidden">
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
            )
          }
        >
          <Icon className="w-5 h-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
