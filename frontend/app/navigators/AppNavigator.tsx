/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { observer } from "mobx-react-lite"
import { NavigationContainer } from "@react-navigation/native"
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs"
import { Toast, ToastDescription, ToastTitle, VStack, useToast, config } from "@gluestack-ui/themed"
import React, { useEffect } from "react"
import Config from "../config"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { Auth, Feed, Onboarding, ProfileNavigator } from "app/screens"
import { useStores } from "app/models"
import { useRealtimeManagerContext } from "app/services/realtime-manager"
import { Events } from "app/services/realtime-manager/events"

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

  const { addRealtimeListener, removeRealtimeListener } = useRealtimeManagerContext()

  useEffect(() => {
    const handleConnect = () => {
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
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast" + id
          return (
            <Toast nativeID={toastId} action="attention" variant="solid">
              <VStack space="xs">
                <ToastTitle>Tasty XP</ToastTitle>
                <ToastDescription>You answered correctly and got level points!!</ToastDescription>
              </VStack>
            </Toast>
          )
        },
      })
    }

    const handleUserLevelUp = () => {
      toast.show({
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast" + id
          return (
            <Toast nativeID={toastId} action="attention" variant="solid">
              <VStack space="xs">
                <ToastTitle>Level Up!</ToastTitle>
              </VStack>
            </Toast>
          )
        },
      })
    }

    addRealtimeListener(Events.connect, handleConnect)
    addRealtimeListener(Events.userChangeInXP, handleUserChangeInXp)
    addRealtimeListener(Events.userLevelUp, handleUserLevelUp)

    return () => {
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
        tabBarItemStyle: { backgroundColor: config.tokens.colors.backgroundDark700 },
        tabBarLabelStyle: {
          fontSize: config.tokens.fontSizes.sm,
        },
      }}
    >
      {isAuthenticated && !isOnboarded && (
        <>
          <Tab.Screen options={hideTabBar} name="Onboarding" component={Onboarding} />
        </>
      )}

      {isAuthenticated && isOnboarded && (
        <>
          <Tab.Screen name="Feed" component={Feed} />
          <Tab.Screen name="Profile" component={ProfileNavigator} />
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
