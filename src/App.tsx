import { Navigate, Route, Routes } from 'react-router'
import LoginPage from './page/LoginPage'
import RegisterPage from './page/Register'
import Dashboard from './page/Dashboard'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/placeholder" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

