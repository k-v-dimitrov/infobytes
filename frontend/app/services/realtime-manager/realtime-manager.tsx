import React, { createContext, useContext, useEffect, useRef } from "react"
import { io } from "socket.io-client"

import Config from "../../config"
import { useStores } from "app/models"
import { Events } from "./events"

const MAX_ALLOWED_LISTENERS = 10

const useRealtimeManager = () => {
  const { current: socket } = useRef(io(Config.SOCKET_URL, { reconnectionDelay: 10000 }))

  const {
    authenticationStore: { token: userToken },
  } = useStores()

  const addRealtimeListener = (event: Events, callback: (payload: unknown) => void) => {
    const hasReachedMaxListenersCount = socket.listeners(event).length > MAX_ALLOWED_LISTENERS

    if (hasReachedMaxListenersCount) {
      throw new Error(
        `Realtime Manager: Reached maximum listeners for event ${event}. Memory leak? `,
      )
    }

    socket.on(event, (p) => {
      callback(p)
    })
  }

  const removeRealtimeListener = (event: Events, handler: (...args: any[]) => void) => {
    const hasAnyListener = socket.listeners(event).length > 0

    if (!hasAnyListener) {
      console.warn(`Trying to remove ${event} which has no listeners!`)
      return
    }

    socket.removeListener(event, handler)
  }

  useEffect(() => {
    socket.on("connect", () => {
      // TODO: This needs to be emitted not only on socked server connect but on login as well!
      // Think about other possible failures...
      socket.emit("identity", { jwt: userToken })
    })

    return () => {
      socket.removeAllListeners()
    }
  }, [socket])

  return { addRealtimeListener, removeRealtimeListener }
}

type ContextType = ReturnType<typeof useRealtimeManager>
const RealtimeContext = createContext<ContextType>(null)

const RealtimeProvider = ({ children }: { children: React.ReactNode }) => {
  const { addRealtimeListener, removeRealtimeListener } = useRealtimeManager()

  return (
    <RealtimeContext.Provider value={{ addRealtimeListener, removeRealtimeListener }}>
      {children}
    </RealtimeContext.Provider>
  )
}

const useRealtimeManagerContext = () => useContext(RealtimeContext)

export { RealtimeProvider, useRealtimeManagerContext }
