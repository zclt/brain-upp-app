import { useMemo, useState } from 'react'
import { useNotesStore } from '@/stores/notesStore'
import { useUIStore } from '@/stores/uiStore'
import { TodoItem } from './TodoItem'
import { TodoFilters, type TodoFilter } from './TodoFilters'
import { Button } from '@/components/ui/button'
import { Plus, ListTodo } from 'lucide-react'

export function TodoList() {
  const notes = useNotesStore((s) => s.notes)
  const openModal = useUIStore((s) => s.openModal)
  const [filter, setFilter] = useState<TodoFilter>({ status: 'all', priority: 'all' })

  const filtered = useMemo(() => {
    return notes
      .filter((n) => {
        const statusOk = filter.status === 'all' || n.status === filter.status
        const priorityOk = filter.priority === 'all' || n.priority === filter.priority
        return statusOk && priorityOk
      })
      .sort((a, b) => {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3, none: 4 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      })
  }, [notes, filter])

  return (
    <div>
      <TodoFilters filter={filter} onChange={setFilter} />

      <div className="mt-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <ListTodo className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-4">No notes match your filters</p>
            <Button onClick={() => openModal()} variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Create a note
            </Button>
          </div>
        ) : (
          <div className="bg-card rounded-xl border shadow-sm divide-y-0">
            <div className="px-4">
              {filtered.map((note) => (
                <TodoItem key={note.id} note={note} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
