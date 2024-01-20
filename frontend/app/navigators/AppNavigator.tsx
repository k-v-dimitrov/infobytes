/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import React, { useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { observer } from "mobx-react-lite"
import { config } from "@gluestack-ui/config"
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs"
import { Toast, ToastDescription, ToastTitle, VStack, useToast } from "@gluestack-ui/themed"
import { useRealtimeManagerContext } from "app/services/realtime-manager"
import { Events } from "app/services/realtime-manager/events"
import { Auth, Feed, Onboarding, ProfileNavigator, Dev } from "app/screens"
import { useStores } from "app/models"
import { FeedIcon } from "app/icons"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import Config from "../config"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Auth: undefined
  Onboarding: undefined
  Feed: undefined
  Profile: undefined
  Dev: undefined
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes
const hideTabBar: BottomTabNavigationOptions = {
  tabBarStyle: {
    display: "none",
  },
}

export type AppStackScreenProps<T extends keyof AppStackParamList> = BottomTabNavigationProp<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Tab = createBottomTabNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  const { authenticationStore } = useStores()
  const { isAuthenticated, isOnboarded } = authenticationStore
  const toast = useToast()

  const { addRealtimeListener, removeRealtimeListener, disconnect, reconnect, isConnected } =
    useRealtimeManagerContext()

  useEffect(() => {
    if (!isAuthenticated && isConnected) {
      disconnect()
    }

    if (isAuthenticated && !isConnected) {
      reconnect()
    }
  }, [isAuthenticated, isConnected])

  useEffect(() => {
    const handleConnect = () => {
      console.log("User Connected!")
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id
          return (
            <Toast nativeID={toastId} action="attention" variant="solid">
              <VStack space="xs">
                <ToastTitle>Connected</ToastTitle>
                <ToastDescription>Connected to socket server successfully!</ToastDescription>
              </VStack>
            </Toast>
          )
        },
      })
    }

    const handleUserChangeInXp = () => {
      authenticationStore.sync()
    }

    const handleUserLevelUp = () => {
      authenticationStore.sync()
    }

    const handleUserDisconnect = () => {
      console.log("User disconnected!")
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast" + id
          return (
            <Toast nativeID={toastId} action="attention" variant="solid">
              <VStack space="xs">
                <ToastTitle>Disconnect!</ToastTitle>
              </VStack>
            </Toast>
          )
        },
      })
    }

    addRealtimeListener(Events.disconnect, handleUserDisconnect)
    addRealtimeListener(Events.connect, handleConnect)
    addRealtimeListener(Events.userChangeInXP, handleUserChangeInXp)
    addRealtimeListener(Events.userLevelUp, handleUserLevelUp)

    return () => {
      removeRealtimeListener(Events.disconnect, handleUserDisconnect)
      removeRealtimeListener(Events.connect, handleConnect)
      removeRealtimeListener(Events.userChangeInXP, handleUserChangeInXp)
      removeRealtimeListener(Events.userLevelUp, handleUserLevelUp)
    }
  }, [])

  return (
    <Tab.Navigator
      initialRouteName={isAuthenticated ? "Feed" : "Auth"}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarItemStyle: { backgroundColor: config.tokens.colors.black },
      }}
    >
      {isAuthenticated && !isOnboarded && (
        <>
          <Tab.Screen options={hideTabBar} name="Onboarding" component={Onboarding} />
        </>
      )}

      {isAuthenticated && isOnboarded && (
        <>
          <Tab.Screen
            name="Feed"
            component={Feed}
            options={{
              tabBarIcon: ({ focused }) => (
                <FeedIcon color={focused ? "$blue500" : "$white"} height="$12" width="$12" />
              ),
              tabBarStyle: { borderTopWidth: 0 },
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileNavigator}
            options={{ tabBarButton: () => null }}
          />
          {/* <Tab.Screen name="Dev" component={Dev} options={{ tabBarShowLabel: true }} /> */}
        </>
      )}

      {!isAuthenticated && (
        <>
          <Tab.Screen options={hideTabBar} name="Auth" component={Auth} />
        </>
      )}
    </Tab.Navigator>
  )
})

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer ref={navigationRef} {...props}>
      <AppStack />
    </NavigationContainer>
  )
})
