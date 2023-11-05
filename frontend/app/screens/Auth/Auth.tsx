import React, { useState } from "react"
import { Providers, LoginForm, RegisterForm } from "./components"
import { Screen } from "app/components"
import { AppStackScreenProps } from "app/navigators"

export const Auth = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true)

  const toggleIsLogin = () => {
    setIsLogin((prev) => !prev)
  }

  const onSubmitSuccess = () => {
    navigation.navigate(isLogin ? "Feed" : "Onboarding")
  }

  return (
    <Screen justifyContent="space-around">
      {isLogin && <LoginForm toggleIsLogin={toggleIsLogin} onSubmitSuccess={onSubmitSuccess} />}
      {!isLogin && <RegisterForm toggleIsLogin={toggleIsLogin} onSubmitSuccess={onSubmitSuccess} />}

      <Providers />
    </Screen>
  )
}
