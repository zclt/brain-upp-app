# Brain-Upp

[![Deploy](https://github.com/zclt/brain-upp-app/actions/workflows/deploy.yml/badge.svg)](https://github.com/zclt/brain-upp-app/actions/workflows/deploy.yml)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Firebase](https://img.shields.io/badge/Firebase-11-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![Node.js](https://img.shields.io/badge/Node.js-24-339933?logo=node.js&logoColor=white)](https://nodejs.org)

Organize your notes, studies, and research in one place. Brain-Upp is a productivity app with Dashboard, Kanban board, and Todo list views, backed by Firebase with Google authentication.

## Features

- **Dashboard** — overview of notes grouped by priority with quick stats
- **Kanban Board** — drag-and-drop columns: Backlog, Todo, In Progress, Done
- **Todo List** — flat list view with filtering and status controls
- **Trash / Soft Delete** — deleted notes go to trash, restorable within 30 days; max 10 items; auto-purge on expiry
- **Quick Note** — inline memo panel (press `N` anywhere) where the first line is the title and remaining lines are the description; includes a **voice input button** (hold to record, release to save) powered by the Web Speech API — auto-saves when the transcribed text reaches at least 10 characters
- **Browser Notifications** — notifies when a task is due today (permission requested on first load)
- **Internationalization** — English, Portuguese (pt-BR), and Spanish (es-PE) with language selector
- **Google Sign-In** — popup-based OAuth via Firebase Authentication
- **Real-time sync** — data persisted in Firestore per user

## Tech Stack

| Layer | Library / Tool |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Routing | React Router DOM 7 |
| State | Zustand 5 |
| Styling | Tailwind CSS 3 + shadcn/ui (Radix UI) |
| Forms | React Hook Form + Zod |
| Drag & Drop | dnd-kit |
| i18n | i18next + react-i18next |
| Backend | Firebase 11 (Auth + Firestore) |
| Date utils | date-fns 4 |

## Prerequisites

- Node.js >= 18
- A Firebase project with **Authentication** (Google provider) and **Firestore** enabled

## Environment Variables

Create a `.env` file at the project root:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

All values are found in the Firebase console under **Project Settings → Your apps → SDK setup**.

## Firebase Setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Authentication → Sign-in method → Google**.
3. Enable **Firestore Database** (start in production mode).
4. Add your app domain (and `localhost`) to **Authentication → Settings → Authorized domains**.
5. Copy the SDK config values into `.env`.

### Firestore Security Rules (recommended)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/notes/{noteId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }
  }
}
```

## Running Locally

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Type-check + production build
npm run build

# Preview the production build locally
npm run preview
```

## Deploying

### Firebase Hosting (recommended)

```bash
# Install Firebase CLI (once)
npm install -g firebase-tools

# Log in
firebase login

# Initialize hosting in the project root (select your project, set public dir to "dist")
firebase init hosting

# Build and deploy
npm run build
firebase deploy --only hosting
```

The app will be served at `https://<project-id>.web.app`.

### Vercel

```bash
# Install Vercel CLI (once)
npm install -g vercel

# Deploy (follow the prompts)
vercel

# For production
vercel --prod
```

Add each `VITE_FIREBASE_*` variable in **Vercel → Project → Settings → Environment Variables** before deploying.

### Netlify

```bash
# Install Netlify CLI (once)
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --dir=dist --prod
```

Add the `VITE_FIREBASE_*` variables in **Netlify → Site → Environment variables**.

> **SPA routing** — for Vercel and Netlify, configure a rewrite so all paths serve `index.html`:
>
> - **Vercel**: add a `vercel.json` at the root:
>   ```json
>   { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
>   ```
> - **Netlify**: add a `public/_redirects` file:
>   ```
>   /* /index.html 200
>   ```

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `N` | Open Quick Note panel |
| `Ctrl+Enter` / `⌘+Enter` | Save Quick Note |
| `Esc` | Close Quick Note |

## Project Structure

```
src/
├── components/
│   ├── auth/        # GoogleSignInButton, ProtectedRoute
│   ├── dashboard/   # StatsBar, PrioritySection, TodoSection, CompletedSection
│   ├── kanban/      # KanbanBoard, KanbanColumn, KanbanCard, ColumnHeader
│   ├── layout/      # Sidebar, TopBar, MobileNav, UserMenu, LanguageSelector, ThemeToggle
│   ├── notes/       # NoteCard, NoteModal, QuickNote (voice input), PriorityIndicator, TagBadge
│   ├── todo/        # TodoList, TodoItem, TodoFilters
│   └── ui/          # shadcn/ui primitives (badge, button, card, dialog, dropdown-menu,
│                    #   input, label, select, separator, skeleton, textarea)
│                    #   + ConfirmDialog, LoadingScreen
├── config/          # Firebase initialization
├── hooks/           # useAuth, useNotes, useKanban, useTrash, usePriority, useTaskNotifications
├── i18n/            # i18next setup + locales (en-US, pt-BR, es-PE)
├── layouts/         # AppLayout, AuthLayout
├── lib/             # utils (cn), constants (MAX_TASKS, …)
├── pages/           # DashboardPage, KanbanPage, TodoPage, TrashPage, LoginPage
├── router/          # createBrowserRouter config
├── services/        # notes.service.ts (Firestore CRUD + soft delete)
│                    # auth.service.ts (Google sign-in / sign-out)
├── stores/          # Zustand stores: authStore, notesStore, trashStore, uiStore, themeStore
├── styles/          # globals.css (Tailwind base + CSS variables)
└── types/           # note.ts, user.ts, index.ts
```
