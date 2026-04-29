import type { NoteStatus, Priority, NoteCategory } from '@/types/note'

export const MAX_TASKS = 50

export const KANBAN_COLUMNS: { id: NoteStatus; label: string; color: string }[] = [
  { id: 'backlog',     label: 'Backlog',      color: 'slate'  },
  { id: 'todo',        label: 'To Do',        color: 'blue'   },
  { id: 'in_progress', label: 'In Progress',  color: 'amber'  },
  { id: 'done',        label: 'Done',         color: 'green'  },
]

export const PRIORITY_LEVELS: { value: Priority; label: string; color: string }[] = [
  { value: 'urgent', label: 'Urgent',  color: 'red'    },
  { value: 'high',   label: 'High',    color: 'orange' },
  { value: 'medium', label: 'Medium',  color: 'yellow' },
  { value: 'low',    label: 'Low',     color: 'blue'   },
  { value: 'none',   label: 'None',    color: 'slate'  },
]

export const NOTE_CATEGORIES: { value: NoteCategory; label: string }[] = [
  { value: 'study',     label: 'Study'     },
  { value: 'research',  label: 'Research'  },
  { value: 'idea',      label: 'Idea'      },
  { value: 'reference', label: 'Reference' },
  { value: 'task',      label: 'Task'      },
  { value: 'other',     label: 'Other'     },
]
