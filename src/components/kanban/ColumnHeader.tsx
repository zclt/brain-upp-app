import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { NoteStatus } from '@/types/note'

const colorMap: Record<NoteStatus, string> = {
  backlog:     'bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300',
  todo:        'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300',
  in_progress: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300',
  done:        'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300',
}

interface ColumnHeaderProps {
  id: NoteStatus
  label: string
  count: number
}

export function ColumnHeader({ id, label, count }: ColumnHeaderProps) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-semibold text-sm text-foreground">
        {t(`columns.${id}`, { defaultValue: label })}
      </h3>
      <span className={cn('inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold', colorMap[id])}>
        {count}
      </span>
    </div>
  )
}
