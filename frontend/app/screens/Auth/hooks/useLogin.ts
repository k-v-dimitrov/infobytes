import { useState } from "react"
import { useStores } from "app/models"
import { Credentials, api } from "app/services/api"
import { saveString } from "app/utils/storage"
import { navigate } from "app/navigators"

export const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const { authenticationStore } = useStores()

  const login = async (credentials: Credentials) => {
    setLoading(true)

    const { error, data } = await api.login(credentials)

    if (error) {
      setError(error)

      return
    }

    try {
      await saveString("userAuthToken", data.token)
      authenticationStore.authenticate(data.user)
      navigate({ name: "Feed", params: undefined })
    } catch (err) {
      setError("Something went wrong!")
    } finally {
      setLoading(false)
    }
  }

  return { login, loading, error }
}
