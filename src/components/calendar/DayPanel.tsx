import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { format, parseISO } from 'date-fns'
import { CalendarDays, X } from 'lucide-react'
import { getDateLocale } from '@/lib/dates'
import { NoteCard } from '@/components/notes/NoteCard'
import type { Note } from '@/types/note'

interface DayPanelProps {
  day: string
  notes: Note[]
  onClose: () => void
}

export function DayPanel({ day, notes, onClose }: DayPanelProps) {
  const { t } = useTranslation()

  // Esc closes the panel
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <>
      <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-40 w-full sm:w-96 bg-background border-l shadow-xl flex flex-col lg:static lg:z-auto lg:shadow-none lg:w-96 lg:shrink-0">
        <div className="flex items-start justify-between gap-3 px-4 py-4 border-b shrink-0">
          <div>
            <p className="font-semibold capitalize">
              {format(parseISO(day), 'EEEE, PPP', { locale: getDateLocale() })}
            </p>
            <p className="text-xs text-muted-foreground">{t('calendar.itemsCount', { count: notes.length })}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-accent"
            aria-label={t('calendar.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 pb-20 lg:pb-4">
          {notes.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDays className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{t('calendar.noItems')}</p>
            </div>
          ) : (
            notes.map((note) => <NoteCard key={note.id} note={note} />)
          )}
        </div>
      </aside>
    </>
  )
}
