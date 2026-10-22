import { cn } from '@/lib/utils'
import type { Note } from '@/types/note'
import type { ViewMode } from '@/stores/viewStore'
import { NoteCard } from './NoteCard'

/** Note cards as a vertical list or a responsive 3 → 2 → 1 column grid. */
export function NoteList({ notes, view }: { notes: Note[]; view: ViewMode }) {
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
