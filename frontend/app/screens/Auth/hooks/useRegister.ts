import { useState } from "react"
import { Credentials, authApi } from "app/services/api"
import { useStores } from "app/models"
import { navigate } from "app/navigators"

export const useRegister = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const { authenticationStore } = useStores()

  const register = async (credentials: Credentials) => {
    setLoading(true)

    try {
      const { error, data } = await authApi.register(credentials)

      if (error) {
        throw new Error(error)
      }

      await authenticationStore.authenticate(data.token)
      navigate({ name: "Onboarding", params: undefined })
    } catch (err) {
      console.log(err)
      setError("Something went wrong!")
    }

    setLoading(false)
  }

  return { register, loading, error }
}
