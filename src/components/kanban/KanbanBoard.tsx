import { useRef, useCallback, useState, useEffect } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useKanban } from '@/hooks/useKanban'
import { useAuthStore } from '@/stores/authStore'
import { useNotesStore } from '@/stores/notesStore'
import { updateNote, reorderNotes } from '@/services/notes.service'
import { KanbanColumn } from './KanbanColumn'
import { NoteCard } from '@/components/notes/NoteCard'
import type { Note, NoteStatus } from '@/types/note'

type Column = { id: NoteStatus; label: string; notes: Note[] }

export function KanbanBoard() {
  const { columns: storeColumns } = useKanban()
  const user = useAuthStore((s) => s.user)
  const { updateNote: updateStoreNote } = useNotesStore()

  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [columns, setColumns] = useState<Column[]>(storeColumns)

  // Ref always mirrors the latest columns — avoids stale closures in drag handlers
  const columnsRef = useRef<Column[]>(storeColumns)

  // Captured once on dragStart — active.data.current is reactive and changes mid-drag
  const originalStatusRef = useRef<NoteStatus | null>(null)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync from store when not dragging
  useEffect(() => {
    if (!activeNote) {
      columnsRef.current = storeColumns
      setColumns(storeColumns)
    }
  }, [storeColumns, activeNote])

  function applyColumns(updater: (prev: Column[]) => Column[]) {
    setColumns((prev) => {
      const next = updater(prev)
      columnsRef.current = next
      return next
    })
  }

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
  )

  function findColumnInRef(id: string): Column | undefined {
    return (
      columnsRef.current.find((c) => c.id === id) ??
      columnsRef.current.find((c) => c.notes.some((n) => n.id === id))
    )
  }

  function handleDragStart(event: DragStartEvent) {
    const note = event.active.data.current?.note as Note | undefined
    setActiveNote(note ?? null)
    // Capture original status before any re-render changes active.data.current
    originalStatusRef.current = note?.status ?? null
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string
    if (activeId === overId) return

    const activeCol = findColumnInRef(activeId)
    const overCol = findColumnInRef(overId)
    if (!activeCol || !overCol || activeCol.id === overCol.id) return

    applyColumns((cols) => {
      const activeIndex = activeCol.notes.findIndex((n) => n.id === activeId)
      const overIndex = overCol.notes.findIndex((n) => n.id === overId)
      const insertAt = overIndex >= 0 ? overIndex : overCol.notes.length
      const moved = { ...activeCol.notes[activeIndex], status: overCol.id as NoteStatus }

      return cols.map((col) => {
        if (col.id === activeCol.id) return { ...col, notes: col.notes.filter((n) => n.id !== activeId) }
        if (col.id === overCol.id) {
          const next = [...col.notes]
          next.splice(insertAt, 0, moved)
          return { ...col, notes: next }
        }
        return col
      })
    })
  }

  const scheduleReorder = useCallback(
    (updates: { id: string; columnOrder: number }[]) => {
      if (!user) return
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        reorderNotes(user.uid, updates).catch(console.error)
      }, 400)
    },
    [user],
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveNote(null)

    const originalStatus = originalStatusRef.current
    originalStatusRef.current = null

    if (!over || !user || !originalStatus) return

    const activeId = active.id as string
    const overId = over.id as string

    // Use ref — always has the latest state, no stale closure issue
    const currentCol = findColumnInRef(activeId)
    if (!currentCol) return

    // Compare against ref captured at dragStart, not active.data.current
    // (dnd-kit updates active.data.current reactively mid-drag)
    const isCrossColumn = originalStatus !== currentCol.id

    if (isCrossColumn) {
      // onDragOver already placed it in the right column and position
      const newOrder = currentCol.notes.findIndex((n) => n.id === activeId)
      updateStoreNote(activeId, { status: currentCol.id as NoteStatus, columnOrder: newOrder })
      updateNote(user.uid, activeId, {
        status: currentCol.id as NoteStatus,
        columnOrder: newOrder,
      }).catch(console.error)
    } else {
      // Same column: apply final sort
      const oldIndex = currentCol.notes.findIndex((n) => n.id === activeId)
      const newIndex = currentCol.notes.findIndex((n) => n.id === overId)
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return

      const reordered = arrayMove(currentCol.notes, oldIndex, newIndex)
      const updates = reordered.map((n, i) => ({ id: n.id, columnOrder: i }))

      applyColumns((cols) =>
        cols.map((col) => (col.id === currentCol.id ? { ...col, notes: reordered } : col)),
      )
      updates.forEach(({ id, columnOrder }) => updateStoreNote(id, { columnOrder }))
      scheduleReorder(updates)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 p-6 overflow-x-auto min-h-full pb-20 lg:pb-6">
        {columns.map((col) => (
          <KanbanColumn key={col.id} id={col.id} label={col.label} notes={col.notes} />
        ))}
      </div>

      <DragOverlay>
        {activeNote && <NoteCard note={activeNote} className="rotate-1 shadow-xl" />}
      </DragOverlay>
    </DndContext>
  )
}
