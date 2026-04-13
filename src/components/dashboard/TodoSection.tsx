import { ListTodo } from 'lucide-react'
import type { Note } from '@/types/note'
import { NoteCard } from '@/components/notes/NoteCard'

export function TodoSection({ notes }: { notes: Note[] }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <ListTodo className="w-4 h-4 text-blue-500" />
        <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Active</h2>
      </div>
      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">Nothing active yet — create your first note!</p>
      ) : (
        <div className="space-y-2">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </section>
  )
}
