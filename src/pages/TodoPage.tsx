import { useNotesStore } from '@/stores/notesStore'
import { TodoList } from '@/components/todo/TodoList'
import { Skeleton } from '@/components/ui/skeleton'

export function TodoPage() {
  const isLoading = useNotesStore((s) => s.isLoading)

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Todo List</h1>
        <p className="text-muted-foreground text-sm">All your notes in one list</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : (
        <TodoList />
      )}
    </div>
  )
}
