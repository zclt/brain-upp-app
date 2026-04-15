import { useTranslation } from 'react-i18next'
import { useNotesStore } from '@/stores/notesStore'
import { KanbanBoard } from '@/components/kanban/KanbanBoard'
import { Skeleton } from '@/components/ui/skeleton'

export function KanbanPage() {
  const { t } = useTranslation()
  const isLoading = useNotesStore((s) => s.isLoading)

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-0 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight">{t('kanban.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('kanban.subtitle')}</p>
      </div>

      {isLoading ? (
        <div className="flex gap-4 p-6 overflow-x-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="min-w-[280px] w-72 space-y-2">
              <Skeleton className="h-8 rounded-lg" />
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-20 rounded-xl" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <KanbanBoard />
        </div>
      )}
    </div>
  )
}
