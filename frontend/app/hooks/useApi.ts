import { api } from "app/services/api"
import { useCallback, useEffect, useState } from "react"

type Request = (...args: any) => Promise<any>

interface Config<T extends Request> {
  props?: Parameters<T>
  executeOnMount?: boolean
  onError?: (error: string) => void
  onSuccess?: () => void
}

export function useApi<T extends Request>(request: T, config?: Config<T>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<Awaited<ReturnType<T>>["data"] | null>(null)

  const { props = [], executeOnMount = true, onError, onSuccess } = config || {}

  const trigger = useCallback(async () => {
    setLoading(true)

    try {
      const { data, error } = await request.call(api, ...(props as []))

      if (error) {
        throw new Error(error)
      }

      setData(data)
      onSuccess && onSuccess()
    } catch (error) {
      setError(error)
      onError && onError(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (executeOnMount) {
      trigger()
    }
  }, [])

  return { loading, error, data, trigger }
}
