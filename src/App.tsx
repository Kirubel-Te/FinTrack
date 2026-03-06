import { useState } from "react"
import LoginPage from "./page/LoginPage"
import RegisterPage from "./page/Register"


const App = () => {
  const [authView, setAuthView] = useState<"login" | "register">("login")

  if (authView === "register") {
    return <RegisterPage onSignIn={() => setAuthView("login")} />
  }

  return <LoginPage onCreateAccount={() => setAuthView("register")} />
}

export default App

