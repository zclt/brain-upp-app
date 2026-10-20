import { useTranslation } from 'react-i18next'
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { cn } from '@/lib/utils'
import { getDateLocale } from '@/lib/dates'
import type { Note } from '@/types/note'

interface MonthGridProps {
  month: Date
  notesByDay: Map<string, Note[]>
  selectedDay: string | null
  onSelectDay: (day: string) => void
}

export function MonthGrid({ month, notesByDay, selectedDay, onSelectDay }: MonthGridProps) {
  const { t } = useTranslation()
  const locale = getDateLocale()

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { locale }),
    end: endOfWeek(endOfMonth(month), { locale }),
  })
  const weekdays = days.slice(0, 7).map((d) => format(d, 'EEEEEE', { locale }))

  return (
    <div className="bg-card rounded-xl border shadow-sm p-3">
      <h2 className="text-sm font-semibold capitalize text-center mb-2">
        {format(month, 'LLLL yyyy', { locale })}
      </h2>

      <div className="grid grid-cols-7 gap-1">
        {weekdays.map((wd, i) => (
          <div key={i} className="text-[11px] font-medium text-muted-foreground text-center capitalize py-1">
            {wd}
          </div>
        ))}

        {days.map((date) => {
          // Days from adjacent months stay blank — they're shown in their own grid
          if (!isSameMonth(date, month)) return <div key={date.toISOString()} />

          const day = format(date, 'yyyy-MM-dd')
          const count = notesByDay.get(day)?.length ?? 0
          const isSelected = day === selectedDay

          return (
            <button
              key={day}
              onClick={() => onSelectDay(day)}
              aria-label={`${format(date, 'PPP', { locale })} — ${t('calendar.itemsCount', { count })}`}
              aria-pressed={isSelected}
              className={cn(
                'relative aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 text-sm transition-colors',
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : count > 0
                    ? 'bg-primary/10 hover:bg-primary/20'
                    : 'hover:bg-accent',
                isToday(date) && !isSelected && 'ring-2 ring-primary/60',
              )}
            >
              <span className={cn('leading-none', isToday(date) && 'font-bold')}>{format(date, 'd')}</span>
              {count > 0 && (
                <span
                  className={cn(
                    'min-w-[1.25rem] px-1 rounded-full text-[10px] font-bold leading-4',
                    isSelected ? 'bg-primary-foreground text-primary' : 'bg-primary text-primary-foreground',
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
