import { format } from 'date-fns'
import { MoreHorizontal, Pencil, Trash2, CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Note } from '@/types/note'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { updateNote, deleteNote } from '@/services/notes.service'
import { PriorityIndicator } from './PriorityIndicator'
import { TagBadge } from './TagBadge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface NoteCardProps {
  note: Note
  className?: string
}

export function NoteCard({ note, className }: NoteCardProps) {
  const user = useAuthStore((s) => s.user)
  const openModal = useUIStore((s) => s.openModal)

  const isDone = note.status === 'done'

  async function toggleDone() {
    if (!user) return
    const newStatus = isDone ? 'todo' : 'done'
    await updateNote(user.uid, note.id, {
      status: newStatus,
      completedAt: newStatus === 'done' ? new Date().toISOString() : null,
    })
  }

  async function handleDelete() {
    if (!user) return
    await deleteNote(user.uid, note.id)
  }

  return (
    <div
      className={cn(
        'group relative bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow',
        isDone && 'opacity-60',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {/* Done toggle */}
        <button
          onClick={toggleDone}
          className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary transition-colors"
          aria-label={isDone ? 'Mark as todo' : 'Mark as done'}
        >
          {isDone ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={cn('font-medium text-sm leading-snug', isDone && 'line-through text-muted-foreground')}>
            {note.title}
          </p>
          {note.content && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{note.content}</p>
          )}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <PriorityIndicator priority={note.priority} />
            {note.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
          {note.dueDate && (
            <p className="text-xs text-muted-foreground mt-1.5">
              Due {format(new Date(note.dueDate), 'MMM d')}
            </p>
          )}
        </div>

        {/* Actions */}
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
    </div>
  )
}
