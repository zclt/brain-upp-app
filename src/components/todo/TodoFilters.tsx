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

const statusOptions: { value: TodoFilter['status']; label: string }[] = [
  { value: 'all',         label: 'All'         },
  { value: 'backlog',     label: 'Backlog'      },
  { value: 'todo',        label: 'To Do'        },
  { value: 'in_progress', label: 'In Progress'  },
  { value: 'done',        label: 'Done'         },
]

const priorityOptions: { value: TodoFilter['priority']; label: string }[] = [
  { value: 'all',    label: 'All Priorities' },
  { value: 'urgent', label: 'Urgent'         },
  { value: 'high',   label: 'High'           },
  { value: 'medium', label: 'Medium'         },
  { value: 'low',    label: 'Low'            },
  { value: 'none',   label: 'None'           },
]

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
