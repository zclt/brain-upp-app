import { createBrowserRouter } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { KanbanPage } from '@/pages/KanbanPage'
import { TodoPage } from '@/pages/TodoPage'
import { TrashPage } from '@/pages/TrashPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthLayout />,
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,    element: <DashboardPage /> },
      { path: 'kanban', element: <KanbanPage /> },
      { path: 'todo',   element: <TodoPage /> },
      { path: 'trash',  element: <TrashPage /> },
    ],
  },
])
