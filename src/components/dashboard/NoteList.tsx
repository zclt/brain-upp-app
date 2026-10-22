import { cn } from '@/lib/utils'
import type { Note } from '@/types/note'
import { NoteCard } from '@/components/notes/NoteCard'
import { useDashboardStore } from '@/stores/dashboardStore'

export function NoteList({ notes }: { notes: Note[] }) {
  const view = useDashboardStore((s) => s.view)

  return (
    <div
      className={cn(
        view === 'columns'
          ? 'grid gap-2 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-start'
          : 'space-y-2',
      )}
    >
      {notes.map((note) => <NoteCard key={note.id} note={note} />)}
    </div>
  )
}
