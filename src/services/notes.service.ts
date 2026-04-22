import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  query,
  orderBy,
  where,
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { Note, NoteCreateInput, NoteUpdateInput } from '@/types/note'

const TRASH_MAX_ITEMS = 10
const TRASH_EXPIRY_DAYS = 30

function notesCol(userId: string) {
  return collection(db, 'users', userId, 'notes')
}

export async function createNote(userId: string, input: NoteCreateInput): Promise<Note> {
  const now = new Date().toISOString()
  const data = { ...input, deletedAt: null, userId, createdAt: now, updatedAt: now }
  const ref = await addDoc(notesCol(userId), data)
  return { ...data, id: ref.id } as Note
}

export async function updateNote(userId: string, noteId: string, input: NoteUpdateInput) {
  const ref = doc(db, 'users', userId, 'notes', noteId)
  await updateDoc(ref, { ...input, updatedAt: new Date().toISOString() })
}

export async function softDeleteNote(userId: string, noteId: string) {
  const ref = doc(db, 'users', userId, 'notes', noteId)
  await updateDoc(ref, { deletedAt: new Date().toISOString() })
}

export async function restoreNote(userId: string, noteId: string) {
  const ref = doc(db, 'users', userId, 'notes', noteId)
  await updateDoc(ref, { deletedAt: null })
}

export async function permanentDeleteNote(userId: string, noteId: string) {
  const ref = doc(db, 'users', userId, 'notes', noteId)
  await deleteDoc(ref)
}

/** Keeps trash within TRASH_MAX_ITEMS. Permanently deletes oldest items beyond the limit. */
export async function enforceTrashLimit(userId: string, trashedNotes: Note[]) {
  if (trashedNotes.length < TRASH_MAX_ITEMS) return

  const sorted = [...trashedNotes].sort(
    (a, b) => new Date(a.deletedAt!).getTime() - new Date(b.deletedAt!).getTime(),
  )
  const toRemove = sorted.slice(0, trashedNotes.length - TRASH_MAX_ITEMS + 1)
  const batch = writeBatch(db)
  toRemove.forEach(({ id }) => {
    batch.delete(doc(db, 'users', userId, 'notes', id))
  })
  await batch.commit()
}

/** Permanently deletes all notes whose deletedAt is older than TRASH_EXPIRY_DAYS. */
export async function purgeExpiredTrash(userId: string, trashedNotes: Note[]) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - TRASH_EXPIRY_DAYS)

  const expired = trashedNotes.filter(
    (n) => n.deletedAt && new Date(n.deletedAt) < cutoff,
  )
  if (expired.length === 0) return

  const batch = writeBatch(db)
  expired.forEach(({ id }) => {
    batch.delete(doc(db, 'users', userId, 'notes', id))
  })
  await batch.commit()
}

/** Permanently deletes all notes in the trash. */
export async function emptyTrash(userId: string, trashedNotes: Note[]) {
  if (trashedNotes.length === 0) return
  const batch = writeBatch(db)
  trashedNotes.forEach(({ id }) => {
    batch.delete(doc(db, 'users', userId, 'notes', id))
  })
  await batch.commit()
}

export function subscribeToNotes(userId: string, callback: (notes: Note[]) => void) {
  const q = query(notesCol(userId), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    const notes: Note[] = snapshot.docs
      .map((d) => ({ id: d.id, ...d.data() } as Note))
      .filter((n) => !n.deletedAt)
    callback(notes)
  })
}

export function subscribeToTrash(userId: string, callback: (notes: Note[]) => void) {
  const q = query(
    notesCol(userId),
    where('deletedAt', '!=', null),
    orderBy('deletedAt', 'desc'),
  )
  return onSnapshot(q, (snapshot) => {
    const notes: Note[] = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Note))
    callback(notes)
  })
}

export async function reorderNotes(
  userId: string,
  updates: { id: string; columnOrder: number }[],
) {
  const batch = writeBatch(db)
  updates.forEach(({ id, columnOrder }) => {
    const ref = doc(db, 'users', userId, 'notes', id)
    batch.update(ref, { columnOrder, updatedAt: new Date().toISOString() })
  })
  await batch.commit()
}
