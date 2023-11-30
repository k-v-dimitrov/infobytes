import { Screen } from "app/components"
import React from "react"
import { Categories, Greet, Nickname } from "./components"
import { Step } from "./types"
import { OnboardingContextProvider, useOnboardingContext } from "./context"

const Steps = () => {
  const { onboardingState } = useOnboardingContext()
  const { step } = onboardingState

  switch (step) {
    case Step.NICKNAME: {
      return <Nickname />
    }
    case Step.GREET: {
      return <Greet />
    }
    case Step.CATEGORIES: {
      return <Categories />
    }
  }
}

export const Onboarding = () => {
  return (
    <Screen justifyContent="space-between">
      <OnboardingContextProvider>
        <Steps />
      </OnboardingContextProvider>
    </Screen>
  )
}
