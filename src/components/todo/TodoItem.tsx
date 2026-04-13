import { format } from 'date-fns'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Note } from '@/types/note'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { updateNote, deleteNote } from '@/services/notes.service'
import { PriorityIndicator } from '@/components/notes/PriorityIndicator'
import { TagBadge } from '@/components/notes/TagBadge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function TodoItem({ note }: { note: Note }) {
  const user = useAuthStore((s) => s.user)
  const openModal = useUIStore((s) => s.openModal)
  const isDone = note.status === 'done'

  async function toggleDone() {
    if (!user) return
    await updateNote(user.uid, note.id, {
      status: isDone ? 'todo' : 'done',
      completedAt: isDone ? null : new Date().toISOString(),
    })
  }

  async function handleDelete() {
    if (!user) return
    await deleteNote(user.uid, note.id)
  }

  return (
    <div className={cn('flex items-start gap-3 py-3 border-b last:border-b-0 group', isDone && 'opacity-60')}>
      <input
        type="checkbox"
        checked={isDone}
        onChange={toggleDone}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium', isDone && 'line-through text-muted-foreground')}>
          {note.title}
        </p>
        {note.content && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{note.content}</p>
        )}
        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
          <PriorityIndicator priority={note.priority} />
          {note.tags.slice(0, 3).map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
          {note.dueDate && (
            <span className="text-xs text-muted-foreground">
              Due {format(new Date(note.dueDate), 'MMM d')}
            </span>
          )}
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-accent transition-opacity" aria-label="More options">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => openModal(note)} className="cursor-pointer">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-destructive focus:text-destructive cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
