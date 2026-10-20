import { format } from 'date-fns'
import type { Note, NoteStatus } from '@/types/note'
import { parseDueDate } from '@/lib/dates'

export type NoteDateKey = 'todo.created' | 'todo.due' | 'todo.updated' | 'todo.completed'

type DateField = 'createdAt' | 'dueDate' | 'updatedAt' | 'completedAt'

// Which dates each status shows, in display order
const DATES_BY_STATUS: Record<NoteStatus, [DateField, NoteDateKey][]> = {
  backlog: [['createdAt', 'todo.created']],
  todo: [['dueDate', 'todo.due']],
  in_progress: [['updatedAt', 'todo.updated'], ['dueDate', 'todo.due']],
  done: [['completedAt', 'todo.completed']],
}

export interface NoteDate {
  labelKey: NoteDateKey
  date: Date
  /** Local calendar day as "yyyy-MM-dd" */
  day: string
}

/** The dates relevant to a note's current status (missing dates are skipped). */
export function getNoteDates(note: Note): NoteDate[] {
  return DATES_BY_STATUS[note.status].flatMap(([field, labelKey]) => {
    const value = note[field]
    if (!value) return []
    const date = field === 'dueDate' ? parseDueDate(value) : new Date(value)
    return [{ labelKey, date, day: format(date, 'yyyy-MM-dd') }]
  })
}
