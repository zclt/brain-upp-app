import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { Priority } from '@/types/note'

const priorityStyles: Record<Priority, string> = {
  urgent: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800',
  high:   'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800',
  low:    'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800',
  none:   'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700',
}

export function PriorityIndicator({ priority }: { priority: Priority }) {
  const { t } = useTranslation()
  if (priority === 'none') return null

  return (
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', priorityStyles[priority])}>
      {t(`priority.${priority}`)}
    </span>
  )
}
