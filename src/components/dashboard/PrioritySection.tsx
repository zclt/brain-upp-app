import { useTranslation } from 'react-i18next'
import { AlertCircle } from 'lucide-react'
import type { Note } from '@/types/note'
import { NoteCard } from '@/components/notes/NoteCard'

export function PrioritySection({ notes }: { notes: Note[] }) {
  const { t } = useTranslation()
  if (notes.length === 0) return null

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="w-4 h-4 text-red-500" />
        <h2 className="text-sm font-semibold text-red-600 uppercase tracking-wide">{t('sections.priority')}</h2>
      </div>
      <div className="space-y-2">
        {notes.map((note) => <NoteCard key={note.id} note={note} />)}
      </div>
    </section>
  )
}
