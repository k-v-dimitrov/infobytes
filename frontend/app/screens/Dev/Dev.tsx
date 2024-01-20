import React from "react"
import { View, Text, Center } from "@gluestack-ui/themed"

import { Screen } from "app/components"
import LottieView from "lottie-react-native"

import GoodJobAnim from "assets/lottie/good-job.json"
export const Dev = () => {
  return (
    <Screen>
      <View borderWidth={2} borderColor="$white" w="$full" h="$full">
        <LottieView
          resizeMode="contain"
          flex={1}
          source={GoodJobAnim}
          colorFilters={[{ keypath: "GOOD JOB! Outlines", color: "white" }]}
          autoPlay
          loop={false}
        />
      </View>
    </Screen>
  )
}
