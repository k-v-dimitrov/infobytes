import { useState } from "react"
import { Credentials, authApi } from "app/services/api"
import { saveString } from "app/utils/storage"
import { useStores } from "app/models"
import { navigate } from "app/navigators"

export const useRegister = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const { authenticationStore } = useStores()

  const register = async (credentials: Credentials) => {
    setLoading(true)

    const { error, data } = await authApi.register(credentials)

    if (error) {
      setError(error)

      return
    }

    try {
      await saveString("userAuthToken", data.token)
      authenticationStore.authenticate(data.user)
      navigate({ name: "Onboarding", params: undefined })
    } catch (err) {
      setError("Something went wrong!")
    }

    setLoading(false)
  }

  return { register, loading, error }
}
