import { useTranslation } from 'react-i18next'
import { format, addDays } from 'date-fns'
import { Trash2, RotateCcw, X, Trash } from 'lucide-react'
import { useTrashStore } from '@/stores/trashStore'
import { useAuthStore } from '@/stores/authStore'
import { useTrash } from '@/hooks/useTrash'
import { restoreNote, permanentDeleteNote, emptyTrash } from '@/services/notes.service'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { PriorityIndicator } from '@/components/notes/PriorityIndicator'
import type { Note } from '@/types/note'

const TRASH_EXPIRY_DAYS = 30

function TrashItem({ note }: { note: Note }) {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)

  const deletedDate = note.deletedAt ? new Date(note.deletedAt) : null
  const expiryDate = deletedDate ? addDays(deletedDate, TRASH_EXPIRY_DAYS) : null

  async function handleRestore() {
    if (!user) return
    await restoreNote(user.uid, note.id)
  }

  async function handleDeleteForever() {
    if (!user) return
    if (!window.confirm(t('trash.confirmDeleteForever'))) return
    await permanentDeleteNote(user.uid, note.id)
  }

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border bg-card">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium line-through text-muted-foreground truncate">
          {note.title}
        </p>
        {note.content && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{note.content}</p>
        )}
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          <PriorityIndicator priority={note.priority} />
          {deletedDate && (
            <span className="text-xs text-muted-foreground">
              {t('trash.deletedOn', { date: format(deletedDate, 'MMM d, yyyy') })}
            </span>
          )}
          {expiryDate && (
            <span className="text-xs text-destructive/70">
              {t('trash.expiresOn', { date: format(expiryDate, 'MMM d, yyyy') })}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={handleRestore}
          className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          title={t('trash.restore')}
          aria-label={t('trash.restore')}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={handleDeleteForever}
          className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
          title={t('trash.deleteForever')}
          aria-label={t('trash.deleteForever')}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export function TrashPage() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const { trashedNotes, isLoading } = useTrashStore()

  useTrash()

  async function handleEmptyTrash() {
    if (!user) return
    if (!window.confirm(t('trash.confirmEmptyTrash'))) return
    await emptyTrash(user.uid, trashedNotes)
  }

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('trash.title')}</h1>
          <p className="text-muted-foreground text-sm">{t('trash.subtitle')}</p>
        </div>
        {trashedNotes.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleEmptyTrash}
            className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
          >
            <Trash className="w-4 h-4 mr-2" />
            {t('trash.emptyTrash')}
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : trashedNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="font-medium">{t('trash.empty')}</p>
          <p className="text-sm text-muted-foreground">{t('trash.emptySubtitle')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {trashedNotes.map((note) => (
            <TrashItem key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  )
}
