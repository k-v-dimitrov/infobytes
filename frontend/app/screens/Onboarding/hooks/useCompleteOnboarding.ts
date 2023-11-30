import { useState } from "react"
import { authApi } from "app/services/api"
import { navigate } from "app/navigators"
import { useStores } from "app/models"
import { OnboardingState } from "../types"

export const useCompleteOnboarding = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const { authenticationStore } = useStores()

  const completeOnboarding = async (onboardingData: Omit<OnboardingState, "step">) => {
    setLoading(true)

    try {
      const { data, error } = await authApi.completeOnboarding(onboardingData)

      if (error) {
        throw new Error()
      }

      const transformData = {
        ...data,
        // @ts-ignore
        categories: data.categories.map(({ category }) => category),
      }

      authenticationStore.authenticate(transformData)
      navigate({ name: "Feed", params: undefined })
    } catch (error) {
      console.log(error)
      setError("Something went wrong!")
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, completeOnboarding }
}
