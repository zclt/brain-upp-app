import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Note } from '@/types/note'
import { NoteCard } from '@/components/notes/NoteCard'

export function KanbanCard({ note }: { note: Note }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: note.id,
    data: { note },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('relative group/kanban', isDragging && 'opacity-40 z-50')}
      {...attributes}
    >
      {/* Drag handle */}
      <button
        {...listeners}
        className="absolute left-1 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover/kanban:opacity-100 hover:bg-accent cursor-grab active:cursor-grabbing transition-opacity touch-none"
        aria-label="Drag"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </button>
      <NoteCard note={note} className="pl-7" />
    </div>
  )
}
