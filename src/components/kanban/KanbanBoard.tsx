import { useRef, useCallback } from 'react'
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
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useState } from 'react'
import { useKanban } from '@/hooks/useKanban'
import { useAuthStore } from '@/stores/authStore'
import { useNotesStore } from '@/stores/notesStore'
import { updateNote, reorderNotes } from '@/services/notes.service'
import { KanbanColumn } from './KanbanColumn'
import { NoteCard } from '@/components/notes/NoteCard'
import type { Note, NoteStatus } from '@/types/note'

export function KanbanBoard() {
  const { columns } = useKanban()
  const user = useAuthStore((s) => s.user)
  const { notes, updateNote: updateStoreNote } = useNotesStore()
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
  )

  function handleDragStart(event: DragStartEvent) {
    const note = event.active.data.current?.note as Note | undefined
    setActiveNote(note ?? null)
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
    setActiveNote(null)
    const { active, over } = event
    if (!over || !user) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeNote = notes.find((n) => n.id === activeId)
    if (!activeNote) return

    // Determine target column
    const targetColumnId =
      columns.find((c) => c.id === overId)?.id ??
      columns.find((c) => c.notes.some((n) => n.id === overId))?.id

    if (!targetColumnId) return

    const isSameColumn = activeNote.status === targetColumnId
    const targetColumn = columns.find((c) => c.id === targetColumnId)!

    if (isSameColumn) {
      // Reorder within column
      const oldIndex = targetColumn.notes.findIndex((n) => n.id === activeId)
      const newIndex = targetColumn.notes.findIndex((n) => n.id === overId)
      if (oldIndex === newIndex || newIndex === -1) return

      const reordered = arrayMove(targetColumn.notes, oldIndex, newIndex)
      const updates = reordered.map((n, i) => ({ id: n.id, columnOrder: i }))

      // Optimistic update
      updates.forEach(({ id, columnOrder }) => updateStoreNote(id, { columnOrder }))
      scheduleReorder(updates)
    } else {
      // Move to different column
      const newOrder = targetColumn.notes.length
      updateStoreNote(activeId, { status: targetColumnId as NoteStatus, columnOrder: newOrder })
      updateNote(user.uid, activeId, {
        status: targetColumnId as NoteStatus,
        columnOrder: newOrder,
      }).catch(console.error)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
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
