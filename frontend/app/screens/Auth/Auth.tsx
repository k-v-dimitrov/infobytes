import React, { useState } from "react"
import { Providers, LoginForm, RegisterForm } from "./components"
import { Screen } from "app/components"

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)

  const toggleIsLogin = () => {
    setIsLogin((prev) => !prev)
  }

  return (
    <Screen justifyContent="space-around">
      {isLogin && <LoginForm toggleIsLogin={toggleIsLogin} />}
      {!isLogin && <RegisterForm toggleIsLogin={toggleIsLogin} />}

      <Providers />
    </Screen>
  )
}
