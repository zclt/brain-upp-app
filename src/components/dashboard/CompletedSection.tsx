import { useTranslation } from 'react-i18next'
import { CheckCircle2 } from 'lucide-react'
import type { Note } from '@/types/note'
import { NoteCard } from '@/components/notes/NoteCard'

export function CompletedSection({ notes }: { notes: Note[] }) {
  const { t } = useTranslation()
  if (notes.length === 0) return null

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle2 className="w-4 h-4 text-green-500" />
        <h2 className="text-sm font-semibold text-green-600 uppercase tracking-wide">{t('sections.recentlyCompleted')}</h2>
      </div>
      <div className="space-y-2">
        {notes.map((note) => <NoteCard key={note.id} note={note} />)}
      </div>
    </section>
  )
}
