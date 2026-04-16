import { useTranslation } from 'react-i18next'
import { Brain, CheckCircle2, Clock, ListTodo } from 'lucide-react'

interface StatsBarProps {
  total: number
  done: number
  inProgress: number
  todo: number
}

export function StatsBar({ total, done, inProgress, todo }: StatsBarProps) {
  const { t } = useTranslation()

  const stats = [
    { label: t('stats.totalNotes'), value: total,      icon: Brain,        color: 'text-violet-600 bg-violet-100 dark:text-violet-300 dark:bg-violet-900/40' },
    { label: t('stats.todo'),       value: todo,       icon: ListTodo,     color: 'text-blue-600   bg-blue-100   dark:text-blue-300   dark:bg-blue-900/40'   },
    { label: t('stats.inProgress'), value: inProgress, icon: Clock,        color: 'text-amber-600  bg-amber-100  dark:text-amber-300  dark:bg-amber-900/40'  },
    { label: t('stats.done'),       value: done,       icon: CheckCircle2, color: 'text-green-600  bg-green-100  dark:text-green-300  dark:bg-green-900/40'  },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-card rounded-xl border p-4 flex items-center gap-3 shadow-sm">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold leading-none">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
