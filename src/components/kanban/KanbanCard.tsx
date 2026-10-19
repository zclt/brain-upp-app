import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'
import type { Note } from '@/types/note'
import { NoteCard } from '@/components/notes/NoteCard'

export function KanbanCard({ note }: { note: Note }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: note.id,
    data: { note },
  })
  const openModal = useUIStore((s) => s.openModal)

  function handleDoubleClick(e: React.MouseEvent) {
    // Ignore double clicks on the card's own controls (checkbox, menu)
    if ((e.target as HTMLElement).closest('button, [role="menuitem"]')) return
    openModal(note)
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group/kanban cursor-grab active:cursor-grabbing select-none',
        isDragging && 'opacity-40',
      )}
      {...attributes}
      {...listeners}
      onDoubleClick={handleDoubleClick}
    >
      {/* Visual drag hint — pointer-events-none so it doesn't interfere */}
      <div className="absolute left-1 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover/kanban:opacity-50 transition-opacity pointer-events-none">
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      <NoteCard note={note} className="pl-7" />
    </div>
  )
}
