import { Navigate, Route, Routes } from 'react-router'
import { useNavigate } from 'react-router'
import type { ReactElement } from 'react'
import LoginPage from './page/loginPage'
import RegisterPage from './page/Register'
import Dashboard, { DashboardLayout } from './page/Dashboard'
import { BudgetsPage } from './page/BudgetPage'
import { TransactionsPage } from './page/TransactionPage'
import PlaceholderPage from './page/PlaceholderPage'
import { LandingPage } from './page/LandingPage'
import { getStoredAccessToken } from './api/auth'

const RequireAuth = ({ children }: { children: ReactElement }) => {
  const token = getStoredAccessToken()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

const RedirectIfAuthenticated = ({ children }: { children: ReactElement }) => {
  const token = getStoredAccessToken()

  if (token) {
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
        <Route
          path="settings"
          element={
            <PlaceholderPage
              notice="Settings page will be available soon."
              backToPath="/app"
              backToLabel="Back to Dashboard"
            />
          }
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

