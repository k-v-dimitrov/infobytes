import { useState } from "react"
import { authApi } from "app/services/api"
import { navigate } from "app/navigators"
import { OnboardingState } from "../types"
import { useStores } from "app/models"

export const useCompleteOnboarding = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const { authenticationStore } = useStores()

  const completeOnboarding = async (onboardingData: Omit<OnboardingState, "step">) => {
    setLoading(true)

    try {
      const { error } = await authApi.completeOnboarding(onboardingData)

      if (error) {
        throw new Error(error)
      }

      await authenticationStore.sync() 
      navigate({ name: "Feed", params: undefined })
    } catch (error) {
      setError("Something went wrong!")
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, completeOnboarding }
}
