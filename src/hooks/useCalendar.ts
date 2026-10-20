import { useMemo } from 'react'
import { useNotesStore } from '@/stores/notesStore'
import { getNoteDates } from '@/lib/noteDates'
import type { Note, NoteStatus } from '@/types/note'

export type CalendarFilter = 'all' | NoteStatus

/** Groups notes by local calendar day ("yyyy-MM-dd") using the status date rule. */
export function useCalendar(filter: CalendarFilter) {
  const notes = useNotesStore((s) => s.notes)

  const notesByDay = useMemo(() => {
    const map = new Map<string, Note[]>()
    for (const note of notes) {
      if (filter !== 'all' && note.status !== filter) continue
      // A note with two dates on the same day is listed once
      const days = new Set(getNoteDates(note).map((d) => d.day))
      for (const day of days) {
        const list = map.get(day)
        if (list) list.push(note)
        else map.set(day, [note])
      }
    }
    return map
  }, [notes, filter])

  return { notesByDay }
}
