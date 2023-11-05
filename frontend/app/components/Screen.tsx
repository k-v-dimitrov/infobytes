import React from "react"
import { View } from "@gluestack-ui/themed"

export const Screen = ({ children, ...props }) => {
  return (
    <View flex={1} p="$10" backgroundColor="$backgroundDark900" {...props}>
      {children}
    </View>
  )
}
