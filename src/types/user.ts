export interface UserProfile {
  uid: string
  displayName: string
  email: string
  photoURL: string | null
  createdAt: string
  preferences: {
    defaultView: 'dashboard' | 'kanban' | 'todo'
    theme: 'light' | 'dark' | 'system'
  }
}
