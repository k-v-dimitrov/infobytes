import React, { createContext, useContext, useEffect, useRef } from "react"
import { io } from "socket.io-client"

import Config from "../../config"
import { useStores } from "app/models"
import { Events } from "./events"

const useRealtimeManager = () => {
  const { current: socket } = useRef(io(Config.SOCKET_URL, { reconnectionDelay: 10000 }))

  const {
    authenticationStore: { token: userToken },
  } = useStores()

  const addRealtimeListener = (event: Events, callback: (payload: unknown) => void) => {
    socket.on(event, (p) => {
      callback(p)
    })
  }

  useEffect(() => {
    socket.on("connect", async () => {
      await socket.emitWithAck("identity", { jwt: userToken })
    })

    return () => {
      socket.removeAllListeners()
    }
  }, [socket])

  return { addRealtimeListener }
}

type ContextType = ReturnType<typeof useRealtimeManager>
const RealtimeContext = createContext<ContextType>(null)

const RealtimeProvider = ({ children }: { children: React.ReactNode }) => {
  const { addRealtimeListener } = useRealtimeManager()

  return (
    <RealtimeContext.Provider value={{ addRealtimeListener }}>{children}</RealtimeContext.Provider>
  )
}

const useRealtimeManagerContext = () => useContext(RealtimeContext)

export { RealtimeProvider, useRealtimeManagerContext }
