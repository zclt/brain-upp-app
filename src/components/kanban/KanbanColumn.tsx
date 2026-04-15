import { useTranslation } from 'react-i18next'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { cn } from '@/lib/utils'
import type { Note, NoteStatus } from '@/types/note'
import { KanbanCard } from './KanbanCard'
import { ColumnHeader } from './ColumnHeader'

interface KanbanColumnProps {
  id: NoteStatus
  label: string
  notes: Note[]
}

export function KanbanColumn({ id, label, notes }: KanbanColumnProps) {
  const { t } = useTranslation()
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div className="flex flex-col min-w-[280px] w-72 shrink-0">
      <ColumnHeader id={id} label={label} count={notes.length} />
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 rounded-xl p-2 space-y-2 min-h-[200px] transition-colors',
          isOver ? 'bg-primary/5 ring-2 ring-primary/20' : 'bg-muted/40',
        )}
      >
        <SortableContext items={notes.map((n) => n.id)} strategy={verticalListSortingStrategy}>
          {notes.map((note) => (
            <KanbanCard key={note.id} note={note} />
          ))}
        </SortableContext>
        {notes.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-6">{t('kanban.dropHere')}</p>
        )}
      </div>
    </div>
  )
}
