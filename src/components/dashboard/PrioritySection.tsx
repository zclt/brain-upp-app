import { useTranslation } from 'react-i18next'
import { AlertCircle } from 'lucide-react'
import type { Note } from '@/types/note'
import { NoteList } from '@/components/notes/NoteList'
import { useViewStore } from '@/stores/viewStore'

export function PrioritySection({ notes }: { notes: Note[] }) {
  const { t } = useTranslation()
  const view = useViewStore((s) => s.views.dashboard)
  if (notes.length === 0) return null

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="w-4 h-4 text-red-500" />
        <h2 className="text-sm font-semibold text-red-600 uppercase tracking-wide">{t('sections.priority')}</h2>
      </div>
      <NoteList notes={notes} view={view} />
    </section>
  )
}
