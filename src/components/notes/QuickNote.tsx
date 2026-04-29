import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { useNotesStore } from '@/stores/notesStore'
import { createNote } from '@/services/notes.service'
import { MAX_TASKS } from '@/lib/constants'
import { AlertCircle } from 'lucide-react'

interface QuickNoteProps {
  open: boolean
  onClose: () => void
}

export function QuickNote({ open, onClose }: QuickNoteProps) {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const notesCount = useNotesStore((s) => s.notes.length)
  const isAtLimit = notesCount >= MAX_TASKS
  const [text, setText] = useState('')
  const [error, setError] = useState(false)
  const [saving, setSaving] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-focus and reset on open
  useEffect(() => {
    if (open) {
      setText('')
      setError(false)
      // Small delay so the element is visible before focusing
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }, [open])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [text])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open, onClose])

  async function handleSave() {
    if (!user) return
    const lines = text.split('\n')
    const title = lines[0].trim().slice(0, 80)
    if (!title) {
      setError(true)
      textareaRef.current?.focus()
      return
    }
    const content = lines.slice(1).join('\n').trim().slice(0, 500)
    setSaving(true)
    try {
      await createNote(user.uid, {
        title,
        content,
        priority: 'none',
        status: 'todo',
        category: 'task',
        tags: [],
        dueDate: null,
        completedAt: null,
        deletedAt: null,
        columnOrder: 0,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSave()
    }
  }

  if (!open) return null

  return (
    <div
      ref={containerRef}
      className={cn(
        'fixed z-50 right-4 top-20 w-80 rounded-xl border bg-popover shadow-lg',
        'animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150',
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-1">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {t('quickNote.label')}
        </span>
        <button
          onClick={onClose}
          className="p-0.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          aria-label={t('quickNote.cancel')}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Textarea or limit warning */}
      <div className="px-3 pb-2">
        {isAtLimit ? (
          <div className="flex items-start gap-2 py-3 text-sm text-destructive min-h-[96px]">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{t('limits.maxTasksReached', { max: MAX_TASKS })}</span>
          </div>
        ) : (
          <>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                if (error) setError(false)
              }}
              onKeyDown={handleKeyDown}
              placeholder={t('quickNote.placeholder')}
              rows={4}
              className={cn(
                'w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground leading-relaxed',
                'min-h-[96px] max-h-64 overflow-y-auto',
                error && 'placeholder:text-destructive',
              )}
            />
            {error && (
              <p className="text-xs text-destructive mb-1">{t('quickNote.titleRequired')}</p>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3 pb-3 pt-1 border-t">
        <span className="text-[11px] text-muted-foreground">{t('quickNote.hint')}</span>
        <div className="flex gap-1.5">
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs rounded-md hover:bg-accent text-muted-foreground transition-colors"
          >
            {t('quickNote.cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || isAtLimit}
            className="px-2.5 py-1 text-xs rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? '…' : t('quickNote.save')}
          </button>
        </div>
      </div>
    </div>
  )
}
