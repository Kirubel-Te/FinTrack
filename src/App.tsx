import { Navigate, Route, Routes } from 'react-router'
import { useNavigate } from 'react-router'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import LoginPage from './page/loginPage'
import RegisterPage from './page/Register'
import Dashboard, { DashboardLayout } from './page/Dashboard'
import { BudgetsPage } from './page/BudgetPage'
import { TransactionsPage } from './page/TransactionPage'
import SettingsPage from './page/SettingsPage'
import { NotificationsPage } from './page/NotificationsPage'
import { LandingPage } from './page/LandingPage'
import { clearAuthSession, getMe, getStoredAccessToken } from './api/auth'

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated'

const AuthGateLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-emerald-zenith-bg px-4 text-center">
    <p className="text-sm font-semibold tracking-wide text-emerald-zenith-text-muted">Checking your session...</p>
  </div>
)

const useAuthStatus = (): AuthStatus => {
  const [status, setStatus] = useState<AuthStatus>(() => (
    getStoredAccessToken() ? 'checking' : 'unauthenticated'
  ))

  useEffect(() => {
    let active = true

    const resolveAuth = async () => {
      const token = getStoredAccessToken()

      if (!token) {
        if (active) {
          setStatus('unauthenticated')
        }
        return
      }

      if (active) {
        setStatus('checking')
      }

      try {
        await getMe()

        if (active) {
          setStatus('authenticated')
        }
      } catch {
        clearAuthSession()

        if (active) {
          setStatus('unauthenticated')
        }
      }
    }

    void resolveAuth()

    return () => {
      active = false
    }
  }, [])

  return status
}

const RequireAuth = ({ children }: { children: ReactElement }) => {
  const status = useAuthStatus()

  if (status === 'checking') {
    return <AuthGateLoader />
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  return children
}

const RedirectIfAuthenticated = ({ children }: { children: ReactElement }) => {
  const status = useAuthStatus()

  if (status === 'checking') {
    return <AuthGateLoader />
  }

  if (status === 'authenticated') {
    return <Navigate to="/app" replace />
  }

  return children
}

const App = () => {
  const navigate = useNavigate()

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LandingPage
            onGetStarted={() => navigate('/register')}
            onLogin={() => navigate('/login')}
          />
        }
      />
      <Route
        path="/app"
        element={(
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        )}
      >
        <Route index element={<Dashboard />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="budgets" element={<BudgetsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route
          path="settings"
          element={<SettingsPage />}
        />
      </Route>
      <Route
        path="/login"
        element={(
          <RedirectIfAuthenticated>
            <LoginPage />
          </RedirectIfAuthenticated>
        )}
      />
      <Route
        path="/register"
        element={(
          <RedirectIfAuthenticated>
            <RegisterPage />
          </RedirectIfAuthenticated>
        )}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

