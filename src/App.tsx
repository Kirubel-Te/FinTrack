import { useEffect, useState } from 'react'
import LoginPage from './page/LoginPage'
import PlaceholderPage from './page/PlaceholderPage'
import RegisterPage from './page/Register'


const App = () => {
  const [authView, setAuthView] = useState<'login' | 'register' | 'placeholder'>('login')
  const [authNotice, setAuthNotice] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthSuccess = (event: Event) => {
      const customEvent = event as CustomEvent<{ notice?: string }>
      setAuthNotice(customEvent.detail?.notice ?? 'Login successful.')
      setAuthView('placeholder')
    }

    window.addEventListener('fintrack:auth-success', handleAuthSuccess)

    return () => {
      window.removeEventListener('fintrack:auth-success', handleAuthSuccess)
    }
  }, [])

  if (authView === 'placeholder') {
    return (
      <PlaceholderPage
        notice={authNotice}
        onBackToLogin={() => {
          setAuthNotice(null)
          setAuthView('login')
        }}
      />
    )
  }

  if (authView === 'register') {
    return (
      <RegisterPage
        onRegisterSuccess={(notice) => {
          setAuthNotice(notice ?? 'Registration successful.')
          setAuthView('placeholder')
        }}
        onSignIn={() => {
          setAuthNotice(null)
          setAuthView('login')
        }}
      />
    )
  }

  return (
    <LoginPage
      notice={authNotice}
      onLoginSuccess={(notice) => {
        setAuthNotice(notice ?? 'Login successful.')
        setAuthView('placeholder')
      }}
      onCreateAccount={() => {
        setAuthNotice(null)
        setAuthView('register')
      }}
    />
  )
}

export default App

