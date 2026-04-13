import {
  signInWithRedirect,
  getRedirectResult,
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

// Initiates Google login — redirects the entire page to Firebase auth handler
export function signInWithGoogle() {
  return signInWithRedirect(auth, provider)
}

// Called once on app boot to capture the auth result after redirect returns
export async function handleRedirectResult() {
  try {
    const result = await getRedirectResult(auth)
    if (result?.user) {
      await upsertUserDoc(result.user)
    }
    return result?.user ?? null
  } catch (err) {
    // Firestore rules not yet deployed — user is still authenticated via
    // onAuthStateChanged; only the profile doc write fails
    console.error('handleRedirectResult error:', err)
    return null
  }
}

export function signOut() {
  return firebaseSignOut(auth)
}
