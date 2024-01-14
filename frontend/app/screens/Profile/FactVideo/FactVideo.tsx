import React from "react"
import { Text } from "@gluestack-ui/themed"
import { Screen } from "app/components"

import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { ProfileStackParamList } from "../ProfileNavigator"

export const FactVideo = ({
  route,
}: NativeStackScreenProps<ProfileStackParamList, "FactVideo">) => {
  const { factId } = route.params
  return (
    <Screen>
      <Text>Video</Text>
      <Text>{factId}</Text>
    </Screen>
  )
}
