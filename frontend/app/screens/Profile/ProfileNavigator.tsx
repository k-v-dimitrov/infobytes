import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Profile } from "./Profile/Profile"
import { ReviewCollection } from "./ReviewCollection/ReviewCollection"
import { FactVideo } from "./FactVideo/FactVideo"

export type ProfileStackParamList = {
  Root: undefined
  ReviewCollection: undefined
  FactVideo: {
    id: string
    title: string
    category: string
  }
}

const Stack = createNativeStackNavigator<ProfileStackParamList>()

export const ProfileNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Root" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={Profile} />
      <Stack.Screen name="ReviewCollection" component={ReviewCollection} />
      <Stack.Screen name="FactVideo" component={FactVideo} />
    </Stack.Navigator>
  )
}
