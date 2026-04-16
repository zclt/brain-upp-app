import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { Priority, NoteStatus } from '@/types/note'

export interface TodoFilter {
  status: 'all' | NoteStatus
  priority: 'all' | Priority
}

interface TodoFiltersProps {
  filter: TodoFilter
  onChange: (f: TodoFilter) => void
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap',
        active
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-background text-muted-foreground border-input hover:border-primary/50',
      )}
    >
      {children}
    </button>
  )
}

export function TodoFilters({ filter, onChange }: TodoFiltersProps) {
  const { t } = useTranslation()

  const statusOptions: { value: TodoFilter['status']; label: string }[] = [
    { value: 'all',         label: t('filters.all')           },
    { value: 'backlog',     label: t('columns.backlog')       },
    { value: 'todo',        label: t('columns.todo')          },
    { value: 'in_progress', label: t('columns.in_progress')   },
    { value: 'done',        label: t('columns.done')          },
  ]

  const priorityOptions: { value: TodoFilter['priority']; label: string }[] = [
    { value: 'all',    label: t('filters.allPriorities') },
    { value: 'urgent', label: t('priority.urgent')       },
    { value: 'high',   label: t('priority.high')         },
    { value: 'medium', label: t('priority.medium')       },
    { value: 'low',    label: t('priority.low')          },
    { value: 'none',   label: t('priority.none')         },
  ]

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((opt) => (
          <Chip
            key={opt.value}
            active={filter.status === opt.value}
            onClick={() => onChange({ ...filter, status: opt.value })}
          >
            {opt.label}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {priorityOptions.map((opt) => (
          <Chip
            key={opt.value}
            active={filter.priority === opt.value}
            onClick={() => onChange({ ...filter, priority: opt.value })}
          >
            {opt.label}
          </Chip>
        ))}
      </div>
    </div>
  )
}
