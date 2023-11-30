import { useState } from "react"
import { useStores } from "app/models"
import { Credentials, authApi } from "app/services/api"
import { navigate } from "app/navigators"

export const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const { authenticationStore } = useStores()

  const login = async (credentials: Credentials) => {
    setLoading(true)

    try {
      const { error, data } = await authApi.login(credentials)

      if (error) {
        throw new Error(error)
      }

      await authenticationStore.authenticate(data.token)
      
      navigate({ name: "Feed", params: undefined })
    } catch (err) {
      setError("Something went wrong!")
    } finally {
      setLoading(false)
    }
  }

  return { login, loading, error }
}
