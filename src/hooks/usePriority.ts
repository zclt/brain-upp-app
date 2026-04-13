import { useMemo } from 'react'
import { useNotesStore } from '@/stores/notesStore'
import type { Note } from '@/types/note'

export function usePriority() {
  const notes = useNotesStore((s) => s.notes)

  const priorityNotes = useMemo<Note[]>(
    () =>
      notes
        .filter((n) => (n.priority === 'urgent' || n.priority === 'high') && n.status !== 'done')
        .sort((a, b) => {
          const order = { urgent: 0, high: 1, medium: 2, low: 3, none: 4 }
          return order[a.priority] - order[b.priority]
        }),
    [notes],
  )

  const todoNotes = useMemo<Note[]>(
    () =>
      notes
        .filter((n) => n.status === 'todo' || n.status === 'in_progress')
        .sort((a, b) => a.columnOrder - b.columnOrder),
    [notes],
  )

  const doneNotes = useMemo<Note[]>(
    () =>
      notes
        .filter((n) => n.status === 'done')
        .sort((a, b) => {
          const aDate = a.completedAt ?? a.updatedAt
          const bDate = b.completedAt ?? b.updatedAt
          return bDate.localeCompare(aDate)
        })
        .slice(0, 10),
    [notes],
  )

  const stats = useMemo(
    () => ({
      total: notes.length,
      done: notes.filter((n) => n.status === 'done').length,
      inProgress: notes.filter((n) => n.status === 'in_progress').length,
      todo: notes.filter((n) => n.status === 'todo').length,
    }),
    [notes],
  )

  return { priorityNotes, todoNotes, doneNotes, stats }
}
