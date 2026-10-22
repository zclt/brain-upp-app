import { useTranslation } from 'react-i18next'
import { LayoutGrid, List } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboardStore, type DashboardView } from '@/stores/dashboardStore'

export function ViewToggle() {
  const { t } = useTranslation()
  const { view, setView } = useDashboardStore()

  const options: { value: DashboardView; label: string; icon: typeof List }[] = [
    { value: 'list',    label: t('dashboard.viewList'),    icon: List       },
    { value: 'columns', label: t('dashboard.viewColumns'), icon: LayoutGrid },
  ]

  return (
    <div className="inline-flex rounded-lg border p-0.5 bg-background" role="group">
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setView(value)}
          aria-label={label}
          aria-pressed={view === value}
          title={label}
          className={cn(
            'p-1.5 rounded-md transition-colors',
            view === value
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent',
          )}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  )
}
