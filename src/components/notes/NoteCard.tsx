import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { MoreHorizontal, Pencil, Trash2, CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Note } from '@/types/note'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'
import { updateNote, softDeleteNote, enforceTrashLimit } from '@/services/notes.service'
import { useTrashStore } from '@/stores/trashStore'
import { PriorityIndicator } from './PriorityIndicator'
import { TagBadge } from './TagBadge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

interface NoteCardProps {
  note: Note
  className?: string
}

export function NoteCard({ note, className }: NoteCardProps) {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const openModal = useUIStore((s) => s.openModal)
  const trashedNotes = useTrashStore((s) => s.trashedNotes)
  const isDone = note.status === 'done'
  const [confirmOpen, setConfirmOpen] = useState(false)

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
    await enforceTrashLimit(user.uid, trashedNotes)
    await softDeleteNote(user.uid, note.id)
  }

  function requestDelete() {
    setConfirmOpen(true)
  }

  return (
    <div
      className={cn(
        'group relative bg-card rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow',
        isDone && 'opacity-60',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={toggleDone}
          className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary transition-colors"
          aria-label={isDone ? t('columns.todo') : t('stats.done')}
        >
          {isDone ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

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
              {t('todo.due', { date: format(new Date(note.dueDate), 'MMM d') })}
            </p>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-accent transition-opacity"
              aria-label={t('common.moreOptions')}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openModal(note)} className="cursor-pointer">
              <Pencil className="mr-2 h-4 w-4" />
              {t('common.edit')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={requestDelete}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t('common.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t('confirm.deleteTitle')}
        description={t('confirm.deleteDescription')}
        confirmLabel={t('confirm.delete')}
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  )
}
