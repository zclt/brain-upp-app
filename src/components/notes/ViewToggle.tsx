import { useTranslation } from 'react-i18next'
import { LayoutGrid, List } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useViewStore, type ViewMode, type ViewPage } from '@/stores/viewStore'

export function ViewToggle({ page }: { page: ViewPage }) {
  const { t } = useTranslation()
  const view = useViewStore((s) => s.views[page])
  const setView = useViewStore((s) => s.setView)

  const options: { value: ViewMode; label: string; icon: typeof List }[] = [
    { value: 'list',    label: t('common.viewList'),    icon: List       },
    { value: 'columns', label: t('common.viewColumns'), icon: LayoutGrid },
  ]

  return (
    <div className="inline-flex rounded-lg border p-0.5 bg-background" role="group">
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setView(page, value)}
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
