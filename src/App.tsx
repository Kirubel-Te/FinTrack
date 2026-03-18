import { Navigate, Route, Routes } from 'react-router'
import HeroPage from './page/HeroPage'
import LoginPage from './page/LoginPage'
import PlaceholderPage from './page/PlaceholderPage'
import RegisterPage from './page/Register'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HeroPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/placeholder" element={<PlaceholderPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

