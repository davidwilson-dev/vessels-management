import { useEffect } from 'react'
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import AppShell from '../shared/components/AppShell'
import LoadingScreen from '../shared/components/LoadingScreen'
import DashboardPage from '../features/dashboard/pages/DashboardPage'
import LoginPage from '../features/auth/pages/LoginPage'
import UsersPage from '../features/users/pages/UsersPage'
import {
  restoreSession,
  selectCurrentUser,
  selectIsAuthenticated,
  selectIsBootstrapped,
} from '../features/auth/authSlice'

function SessionBootstrapper({ children }) {
  const dispatch = useDispatch()
  const isBootstrapped = useSelector(selectIsBootstrapped)

  useEffect(() => {
    if (!isBootstrapped) {
      dispatch(restoreSession())
    }
  }, [dispatch, isBootstrapped])

  return children
}

function ProtectedRoute() {
  const location = useLocation()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isBootstrapped = useSelector(selectIsBootstrapped)
  const currentUser = useSelector(selectCurrentUser)

  if (!isBootstrapped) {
    return <LoadingScreen message="Syncing your admin console..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!['admin', 'staff'].includes(currentUser?.role ?? 'guest')) {
    return <Navigate to="/login" replace />
  }

  return <AppShell />
}

function PublicRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isBootstrapped = useSelector(selectIsBootstrapped)

  if (!isBootstrapped) {
    return <LoadingScreen message="Preparing the sign-in deck..." />
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

function AppRouter() {
  return (
    <BrowserRouter>
      <SessionBootstrapper>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SessionBootstrapper>
    </BrowserRouter>
  )
}

export default AppRouter
