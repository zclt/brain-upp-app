# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Vite dev server on http://localhost:5173
npm run build     # tsc -b (type-check) + vite build
npm run preview   # serve the production build
npx tsc -b --noEmit   # type-check only — the main correctness gate
```

- There is **no test suite**. Verify changes with the type-check and `npm run build`.
- `npm run lint` is currently broken: ESLint 10 is installed but there is no `eslint.config.*` file.
- Running the app needs a `.env` with the `VITE_FIREBASE_*` keys (see README) and a Google sign-in, so most UI can't be exercised without real credentials.

## Deployment & workflow

- `.github/workflows/deploy.yml` deploys to Firebase Hosting **on any tag push**, always building from `main` (`npm ci` → `npm audit --audit-level=high` → build). A high-severity audit finding blocks the deploy.
- Work lands on `main` via PRs from feature branches (`feature/*`, `fix/*`). Commit messages follow Conventional Commits (`feat(scope): …`, `fix(…)`, `chore(…)`, `docs(…)`).
- `functions/` is empty; there are no Cloud Functions.

## Architecture

React 19 + TypeScript SPA (Vite, Tailwind v4 + shadcn/ui, Zustand, React Router 7, i18next, dnd-kit, date-fns). The `@/` alias maps to `src/`.

### Data flow

Firestore is the single source of truth. Every note lives at `users/{uid}/notes/{noteId}` (rules in `firestore.rules` restrict access to the owner).

1. `App.tsx` → `useAuth` listens to Firebase Auth and fills `authStore`. `ProtectedRoute` gates the `AppLayout` routes.
2. `AppLayout` mounts the app-wide subscriptions once: `useNotes`, `useTrash` and `useTaskNotifications`. `useNotes`/`useTrash` call `onSnapshot` in `services/notes.service.ts` and push results into `notesStore` / `trashStore`.
3. Pages and components read from the stores and derive views with memoized hooks (`useKanban`, `usePriority`, `useCalendar`). They write through `notes.service.ts` functions; the snapshot listener then updates the store. A few places (Kanban drag) also update the store optimistically.

Key consequences:
- **Soft delete**: trash is the same collection with `deletedAt != null`. `subscribeToNotes` filters those out client-side; `subscribeToTrash` queries them. Trash is capped at 10 items (`enforceTrashLimit`, call it before `softDeleteNote`) and purged after 30 days on each trash snapshot.
- All writes go through `notes.service.ts`, which sanitizes text and stamps `updatedAt`. Note creation is capped by `MAX_TASKS` (checked in `NoteModal` and `QuickNote`).
- `KanbanBoard` keeps a local copy of the columns plus a ref mirror during a drag, to avoid stale closures in dnd-kit handlers. Reorders are batched and debounced (`reorderNotes`).

### Global UI

`uiStore` owns the note editor modal (`openModal(note?)` to create or edit), the Quick Note panel (`N` shortcut, handled in `AppLayout`) and the mobile sidebar. Any view that needs "edit this note" calls `openModal(note)`. `NoteCard` is shared by Dashboard, Kanban, Calendar and the drag overlay, so changes to it affect every view.

### Dates

All note timestamps are ISO strings. Follow these rules (in `src/lib/dates.ts` and `src/lib/noteDates.ts`):
- `dueDate` is a **calendar day** stored as UTC midnight. Always read it with `parseDueDate()`, never `new Date(dueDate)`, which shifts the day in negative-offset timezones. Compare against today with `todayLocalDay()`.
- Format user-visible dates with `formatDate()` / `getDateLocale()` so they follow the selected language.
- Which date a card shows depends on its status (backlog → `createdAt`, todo → `dueDate`, in_progress → `updatedAt` + `dueDate`, done → `completedAt`). The rule lives in `getNoteDates()` and drives both `NoteCard` and the Calendar's per-day grouping. Change it there, not in components.

### i18n

Three locales in `src/i18n/locales/` (`en-US`, `pt-BR`, `es-PE`), selected via `LanguageSelector` and stored in `localStorage` (`brain-upp-lang`). Translation keys are **not type-checked** against each other, so any new key must be added to all three files by hand. Status labels use `columns.<status>`.
