import { useNotesStore } from '@/stores/notesStore'
import { usePriority } from '@/hooks/usePriority'
import { StatsBar } from '@/components/dashboard/StatsBar'
import { PrioritySection } from '@/components/dashboard/PrioritySection'
import { TodoSection } from '@/components/dashboard/TodoSection'
import { CompletedSection } from '@/components/dashboard/CompletedSection'
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardPage() {
  const isLoading = useNotesStore((s) => s.isLoading)
  const { priorityNotes, todoNotes, doneNotes, stats } = usePriority()

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of your notes and tasks</p>
      </div>

      <StatsBar {...stats} />
      <PrioritySection notes={priorityNotes} />
      <TodoSection notes={todoNotes} />
      <CompletedSection notes={doneNotes} />
    </div>
  )
}
