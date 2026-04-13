import { Brain, CheckCircle2, Clock, ListTodo } from 'lucide-react'

interface StatsBarProps {
  total: number
  done: number
  inProgress: number
  todo: number
}

const stats = [
  { label: 'Total Notes', key: 'total' as const, icon: Brain,        color: 'text-violet-600 bg-violet-100' },
  { label: 'To Do',       key: 'todo'  as const, icon: ListTodo,     color: 'text-blue-600   bg-blue-100'   },
  { label: 'In Progress', key: 'inProgress' as const, icon: Clock,   color: 'text-amber-600  bg-amber-100'  },
  { label: 'Done',        key: 'done'  as const, icon: CheckCircle2, color: 'text-green-600  bg-green-100'  },
]

export function StatsBar({ total, done, inProgress, todo }: StatsBarProps) {
  const values = { total, done, inProgress, todo }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(({ label, key, icon: Icon, color }) => (
        <div key={key} className="bg-white rounded-xl border p-4 flex items-center gap-3 shadow-sm">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold leading-none">{values[key]}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
