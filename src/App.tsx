import { Navigate, Route, Routes } from 'react-router'
import LoginPage from './page/LoginPage'
import RegisterPage from './page/Register'
import Dashboard, { DashboardLayout } from './page/Dashboard'
import { BudgetsPage } from './page/BudgetPage'
import { TransactionsPage } from './page/TransactionPage'
import PlaceholderPage from './page/PlaceholderPage'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="budgets" element={<BudgetsPage />} />
        <Route path="settings" element={<PlaceholderPage notice="Settings page is coming soon." />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

