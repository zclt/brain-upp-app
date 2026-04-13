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
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { Note, NoteCreateInput, NoteUpdateInput } from '@/types/note'

function notesCol(userId: string) {
  return collection(db, 'users', userId, 'notes')
}

export async function createNote(userId: string, input: NoteCreateInput): Promise<Note> {
  const now = new Date().toISOString()
  const data = { ...input, userId, createdAt: now, updatedAt: now }
  const ref = await addDoc(notesCol(userId), data)
  return { ...data, id: ref.id } as Note
}

export async function updateNote(userId: string, noteId: string, input: NoteUpdateInput) {
  const ref = doc(db, 'users', userId, 'notes', noteId)
  await updateDoc(ref, { ...input, updatedAt: new Date().toISOString() })
}

export async function deleteNote(userId: string, noteId: string) {
  const ref = doc(db, 'users', userId, 'notes', noteId)
  await deleteDoc(ref)
}

export function subscribeToNotes(userId: string, callback: (notes: Note[]) => void) {
  const q = query(notesCol(userId), orderBy('createdAt', 'desc'))
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
