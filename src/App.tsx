import { useState } from 'react'
import LoginPage from './page/LoginPage'
import RegisterPage from './page/Register'


const App = () => {
  const [authView, setAuthView] = useState<'login' | 'register'>('login')
  const [authNotice, setAuthNotice] = useState<string | null>(null)

  if (authView === 'register') {
    return (
      <RegisterPage
        onSignIn={(notice) => {
          setAuthNotice(notice ?? null)
          setAuthView('login')
        }}
      />
    )
  }

  return (
    <LoginPage
      notice={authNotice}
      onCreateAccount={() => {
        setAuthNotice(null)
        setAuthView('register')
      }}
    />
  )
}

export default App

