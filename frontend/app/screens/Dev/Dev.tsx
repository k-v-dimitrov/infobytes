import React, { useState } from "react"
import { View, Button, ButtonText } from "@gluestack-ui/themed"

import { Screen } from "app/components"
import LottieView from "lottie-react-native"

import GoodJobAnim from "assets/lottie/good-job.json"
export const Dev = () => {
  const [loop, setLoop] = useState(true)

  return (
    <Screen>
      <View borderWidth={2} borderColor="$white" w="$full" h="$full">
        <LottieView
          resizeMode="contain"
          flex={1}
          source={GoodJobAnim}
          colorFilters={[{ keypath: "GOOD JOB! Outlines", color: "white" }]}
          autoPlay
          loop={loop}
          useNativeLooping
          speed={1}
          onAnimationLoop={() => {
            console.log("Test")
          }}
          onAnimationFinish={() => console.log("finished")}
        />
      </View>
      <Button onPress={() => setLoop((prev) => !prev)}>
        <ButtonText>End At next loop</ButtonText>
      </Button>
    </Screen>
  )
}
