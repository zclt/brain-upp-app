import { format, parseISO } from 'date-fns'
import { enUS, es, ptBR, type Locale } from 'date-fns/locale'
import i18n from '@/i18n'

const LOCALES: Record<string, Locale> = { 'en-US': enUS, 'pt-BR': ptBR, 'es-PE': es }

const PATTERNS = {
  short: { 'en-US': 'MMM d', default: 'd MMM' },
  long: { 'en-US': 'MMM d, yyyy', default: 'd MMM yyyy' },
} as const

/** date-fns locale for the current app language. */
export function getDateLocale(): Locale {
  return LOCALES[i18n.language] ?? enUS
}

/** Formats a date in the current app language. */
export function formatDate(date: Date, style: keyof typeof PATTERNS = 'short'): string {
  const lang = i18n.language
  const patterns: Record<string, string> = PATTERNS[style]
  return format(date, patterns[lang] ?? patterns.default, { locale: getDateLocale() })
}

/**
 * Due dates are calendar days stored as UTC midnight ("2026-10-19T00:00:00.000Z").
 * Read only the day part so it isn't shifted by the local timezone.
 */
export function parseDueDate(dueDate: string): Date {
  return parseISO(dueDate.slice(0, 10))
}

/** Today's local calendar day as "yyyy-MM-dd". */
export function todayLocalDay(): string {
  return format(new Date(), 'yyyy-MM-dd')
}
