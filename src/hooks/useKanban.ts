import { useMemo } from 'react'
import { useNotesStore } from '@/stores/notesStore'
import { KANBAN_COLUMNS } from '@/lib/constants'
import type { NoteStatus, Note } from '@/types/note'

export function useKanban() {
  const notes = useNotesStore((s) => s.notes)

  const columns = useMemo(() => {
    const grouped: Record<NoteStatus, Note[]> = {
      backlog: [],
      todo: [],
      in_progress: [],
      done: [],
    }

    notes.forEach((note) => {
      grouped[note.status].push(note)
    })

    Object.values(grouped).forEach((col) => {
      col.sort((a, b) => a.columnOrder - b.columnOrder)
    })

    return KANBAN_COLUMNS.map((col) => ({
      ...col,
      notes: grouped[col.id],
    }))
  }, [notes])

  return { columns }
}
