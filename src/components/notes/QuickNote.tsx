import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Mic } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { useNotesStore } from '@/stores/notesStore'
import { createNote } from '@/services/notes.service'
import { MAX_TASKS } from '@/lib/constants'
import { AlertCircle } from 'lucide-react'

interface ISpeechRecognition {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: ISpeechRecognitionEvent) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}

interface ISpeechRecognitionEvent {
  results: { length: number; [index: number]: { [index: number]: { transcript: string } } }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognitionCtor = new () => ISpeechRecognition

function getSpeechRecognition(): SpeechRecognitionCtor | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

const MIN_MIC_CHARS = 10

interface QuickNoteProps {
  open: boolean
  onClose: () => void
}

export function QuickNote({ open, onClose }: QuickNoteProps) {
  const { t, i18n } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const notesCount = useNotesStore((s) => s.notes.length)
  const isAtLimit = notesCount >= MAX_TASKS
  const [text, setText] = useState('')
  const [error, setError] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [micTooShort, setMicTooShort] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<ISpeechRecognition | null>(null)
  const shouldSaveOnEndRef = useRef(false)
  const capturedTextRef = useRef('')

  const micSupported = typeof window !== 'undefined' && !!getSpeechRecognition()

  // Auto-focus and reset on open
  useEffect(() => {
    if (open) {
      setText('')
      setError(false)
      setMicTooShort(false)
      capturedTextRef.current = ''
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

  // Abort recognition when modal closes
  useEffect(() => {
    if (!open && recognitionRef.current) {
      shouldSaveOnEndRef.current = false
      recognitionRef.current.abort()
      recognitionRef.current = null
      setIsListening(false)
    }
  }, [open])

  async function saveNote(noteText: string) {
    if (!user) return
    const lines = noteText.split('\n')
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

  async function handleSave() {
    await saveNote(text)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSave()
    }
  }

  function startListening() {
    const SpeechRecognitionAPI = getSpeechRecognition()
    if (!SpeechRecognitionAPI) return

    setText('')
    capturedTextRef.current = ''
    setError(false)
    setMicTooShort(false)

    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = i18n.language

    recognition.onresult = (event: ISpeechRecognitionEvent) => {
      let transcript = ''
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setText(transcript)
      capturedTextRef.current = transcript
      setError(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      if (!shouldSaveOnEndRef.current) return
      shouldSaveOnEndRef.current = false
      const captured = capturedTextRef.current.trim()
      if (captured.length >= MIN_MIC_CHARS) {
        saveNote(captured)
      } else {
        setMicTooShort(true)
        setTimeout(() => setMicTooShort(false), 3000)
      }
    }

    recognition.onerror = () => {
      setIsListening(false)
      shouldSaveOnEndRef.current = false
    }

    recognitionRef.current = recognition
    shouldSaveOnEndRef.current = false
    recognition.start()
    setIsListening(true)
  }

  function stopListening() {
    if (!recognitionRef.current) return
    shouldSaveOnEndRef.current = true
    recognitionRef.current.stop()
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
                capturedTextRef.current = e.target.value
                if (error) setError(false)
              }}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? t('quickNote.micListening') : t('quickNote.placeholder')}
              rows={4}
              className={cn(
                'w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground leading-relaxed',
                'min-h-[96px] max-h-64 overflow-y-auto',
                error && 'placeholder:text-destructive',
                isListening && 'placeholder:text-primary',
              )}
            />
            {error && (
              <p className="text-xs text-destructive mb-1">{t('quickNote.titleRequired')}</p>
            )}
            {micTooShort && (
              <p className="text-xs text-muted-foreground mb-1">{t('quickNote.micTooShort', { min: MIN_MIC_CHARS })}</p>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3 pb-3 pt-1 border-t">
        <div className="flex items-center gap-2">
          {micSupported && !isAtLimit && (
            <button
              onPointerDown={(e) => {
                e.preventDefault()
                startListening()
              }}
              onPointerUp={stopListening}
              onPointerLeave={() => { if (isListening) stopListening() }}
              disabled={saving}
              title={t('quickNote.micHint')}
              aria-label={t('quickNote.micHint')}
              className={cn(
                'p-1.5 rounded-md transition-colors select-none',
                isListening
                  ? 'bg-destructive text-destructive-foreground animate-pulse'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                saving && 'opacity-50 cursor-not-allowed',
              )}
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="text-[11px] text-muted-foreground">{t('quickNote.hint')}</span>
        </div>
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
