import {
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db, provider } from '@/config/firebase'

async function upsertUserDoc(user: {
  uid: string
  displayName: string | null
  email: string | null
  photoURL: string | null
}) {
  const userRef = doc(db, 'users', user.uid)
  const snap = await getDoc(userRef)
  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: new Date().toISOString(),
      preferences: { defaultView: 'dashboard', theme: 'system' },
    })
  }
}

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, provider)
  await upsertUserDoc(result.user)
  return result.user
}

export function signOut() {
  return firebaseSignOut(auth)
}
