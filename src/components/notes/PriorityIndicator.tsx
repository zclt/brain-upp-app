import { cn } from '@/lib/utils'
import type { Priority } from '@/types/note'

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  urgent: { label: 'Urgent', className: 'bg-red-100 text-red-700 border-red-200'    },
  high:   { label: 'High',   className: 'bg-orange-100 text-orange-700 border-orange-200' },
  medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  low:    { label: 'Low',    className: 'bg-blue-100 text-blue-700 border-blue-200'   },
  none:   { label: 'None',   className: 'bg-slate-100 text-slate-500 border-slate-200'  },
}

export function PriorityIndicator({ priority }: { priority: Priority }) {
  const cfg = priorityConfig[priority]
  if (priority === 'none') return null
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', cfg.className)}>
      {cfg.label}
    </span>
  )
}
