import { cn } from '@/lib/utils'
import type { NoteStatus } from '@/types/note'

const colorMap: Record<NoteStatus, string> = {
  backlog:     'bg-slate-100 text-slate-600',
  todo:        'bg-blue-100 text-blue-600',
  in_progress: 'bg-amber-100 text-amber-600',
  done:        'bg-green-100 text-green-600',
}

interface ColumnHeaderProps {
  id: NoteStatus
  label: string
  count: number
}

export function ColumnHeader({ id, label, count }: ColumnHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-semibold text-sm text-foreground">{label}</h3>
      <span className={cn('inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold', colorMap[id])}>
        {count}
      </span>
    </div>
  )
}
