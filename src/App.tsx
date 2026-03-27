import { Navigate, Route, Routes } from 'react-router'
import LoginPage from './page/LoginPage'
import RegisterPage from './page/Register'
import Dashboard, { DashboardLayout } from './page/Dashboard'
import { BudgetsPage } from './page/BudgetPage'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="budgets" element={<BudgetsPage />} />
        <Route path="placeholder" element={<Dashboard />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

