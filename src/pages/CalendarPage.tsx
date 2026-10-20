import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { addMonths, startOfMonth } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNotesStore } from '@/stores/notesStore'
import { useCalendar, type CalendarFilter } from '@/hooks/useCalendar'
import { MonthGrid } from '@/components/calendar/MonthGrid'
import { DayPanel } from '@/components/calendar/DayPanel'
import { Chip } from '@/components/todo/TodoFilters'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const VISIBLE_MONTHS = 3

export function CalendarPage() {
  const { t } = useTranslation()
  const isLoading = useNotesStore((s) => s.isLoading)
  const [firstMonth, setFirstMonth] = useState(() => startOfMonth(new Date()))
  const [filter, setFilter] = useState<CalendarFilter>('all')
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const { notesByDay } = useCalendar(filter)

  const months = Array.from({ length: VISIBLE_MONTHS }, (_, i) => addMonths(firstMonth, i))
  const closePanel = useCallback(() => setSelectedDay(null), [])

  const filterOptions: { value: CalendarFilter; label: string }[] = [
    { value: 'all',         label: t('filters.all')         },
    { value: 'backlog',     label: t('columns.backlog')     },
    { value: 'todo',        label: t('columns.todo')        },
    { value: 'in_progress', label: t('columns.in_progress') },
    { value: 'done',        label: t('columns.done')        },
  ]

  return (
    <div className="h-full flex">
      <div className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('calendar.title')}</h1>
            <p className="text-muted-foreground text-sm">{t('calendar.subtitle')}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setFirstMonth((m) => addMonths(m, -1))}
              aria-label={t('calendar.previous')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={() => setFirstMonth(startOfMonth(new Date()))}>
              {t('calendar.today')}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setFirstMonth((m) => addMonths(m, 1))}
              aria-label={t('calendar.next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {filterOptions.map(({ value, label }) => (
            <Chip key={value} active={filter === value} onClick={() => setFilter(value)}>
              {label}
            </Chip>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {months.map((m) => (
              <Skeleton key={m.toISOString()} className="h-80 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {months.map((m) => (
              <MonthGrid
                key={m.toISOString()}
                month={m}
                notesByDay={notesByDay}
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
              />
            ))}
          </div>
        )}
      </div>

      {selectedDay && (
        <DayPanel day={selectedDay} notes={notesByDay.get(selectedDay) ?? []} onClose={closePanel} />
      )}
    </div>
  )
}
