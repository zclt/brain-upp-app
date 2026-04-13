export type Priority = 'urgent' | 'high' | 'medium' | 'low' | 'none'

export type NoteStatus = 'backlog' | 'todo' | 'in_progress' | 'done'

export type NoteCategory = 'study' | 'research' | 'idea' | 'reference' | 'task' | 'other'

export interface Note {
  id: string
  userId: string
  title: string
  content: string
  status: NoteStatus
  priority: Priority
  category: NoteCategory
  tags: string[]
  dueDate: string | null
  completedAt: string | null
  columnOrder: number
  createdAt: string
  updatedAt: string
}

export type NoteCreateInput = Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
export type NoteUpdateInput = Partial<NoteCreateInput>
