import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNotesStore } from '@/stores/notesStore'
import type { Note } from '@/types/note'

const STORAGE_KEY_PREFIX = 'brain-upp-notified-'
const CHECK_INTERVAL_MS = 30 * 60 * 1000 // 30 minutes

function todayDateString(): string {
  return new Date().toISOString().split('T')[0]
}

function isToday(dateStr: string): boolean {
  return dateStr.split('T')[0] === todayDateString()
}

function getNotifiedIds(): Set<string> {
  const key = STORAGE_KEY_PREFIX + todayDateString()
  try {
    const raw = localStorage.getItem(key)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

function markNotified(id: string): void {
  const key = STORAGE_KEY_PREFIX + todayDateString()
  const ids = getNotifiedIds()
  ids.add(id)
  localStorage.setItem(key, JSON.stringify([...ids]))
}

function cleanupOldKeys(): void {
  const today = todayDateString()
  Object.keys(localStorage)
    .filter((k) => k.startsWith(STORAGE_KEY_PREFIX) && !k.endsWith(today))
    .forEach((k) => localStorage.removeItem(k))
}

async function requestPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const result = await Notification.requestPermission()
  return result === 'granted'
}

function sendNotification(note: Note, title: string, body: string): void {
  if (Notification.permission !== 'granted') return
  const notification = new Notification(title, {
    body,
    icon: '/brain.svg',
    tag: `brain-upp-due-${note.id}`,
    requireInteraction: false,
  })
  notification.onclick = () => {
    window.focus()
    notification.close()
  }
}

export function useTaskNotifications(): void {
  const { t } = useTranslation()
  const notes = useNotesStore((s) => s.notes)
  const isLoading = useNotesStore((s) => s.isLoading)
  const permissionGranted = useRef(false)

  // Request permission once on mount
  useEffect(() => {
    cleanupOldKeys()
    requestPermission().then((granted) => {
      permissionGranted.current = granted
    })
  }, [])

  // Check and notify for due tasks
  const checkAndNotify = (notesList: Note[]) => {
    if (!permissionGranted.current) return
    const notifiedIds = getNotifiedIds()

    const dueTodayNotes = notesList.filter(
      (n) =>
        n.status !== 'done' &&
        n.dueDate !== null &&
        isToday(n.dueDate),
    )

    for (const note of dueTodayNotes) {
      if (notifiedIds.has(note.id)) continue
      const title = t('notifications.dueTodayTitle')
      const body = t('notifications.dueTodayBody', { title: note.title })
      sendNotification(note, title, body)
      markNotified(note.id)
    }
  }

  // Run when notes finish loading or change
  useEffect(() => {
    if (isLoading) return
    checkAndNotify(notes)
  }, [notes, isLoading]) // eslint-disable-line react-hooks/exhaustive-deps

  // Periodic re-check (e.g. app stays open past midnight, or new tasks added)
  useEffect(() => {
    const interval = setInterval(() => {
      const current = useNotesStore.getState().notes
      checkAndNotify(current)
    }, CHECK_INTERVAL_MS)
    return () => clearInterval(interval)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
