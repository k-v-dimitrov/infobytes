import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import {
  Button,
  ButtonText,
  Progress,
  ProgressFilledTrack,
  Text,
  VStack,
  View,
} from "@gluestack-ui/themed"
import { useStores } from "app/models"
import Animated, { BounceInLeft, FadeOut } from "react-native-reanimated"
import { getProgressPercentage } from "./utils"

export const LevelProgressBar = observer(() => {
  const [showAnimation, setShowAnimation] = useState(false)
  const { authenticationStore } = useStores()
  const { level, levelPoints, requiredPointsForNextLevel } = authenticationStore.user

  const progressPercentage = getProgressPercentage(levelPoints, requiredPointsForNextLevel)

  const animate = () => {
    setShowAnimation(true)

    setTimeout(() => setShowAnimation(false), 1500)
  }

  return (
    <VStack>
      <View flexDirection="row" justifyContent="space-between" position="relative">
        <Text size="sm">Level {level}</Text>

        {showAnimation && (
          <Animated.View entering={BounceInLeft} exiting={FadeOut}>
            <View position="absolute" right="50%" bottom={5}>
              <Text fontWeight="$bold" color="$green400" size="xl">
                +50
              </Text>
            </View>
          </Animated.View>
        )}

        <Text size="sm">
          {levelPoints}/{requiredPointsForNextLevel}
        </Text>
      </View>

      <Progress width={250} value={progressPercentage} size="md">
        <ProgressFilledTrack bg="$green400" />
      </Progress>

      {/* button for testing animation start */}
      <View position="absolute" gap="$5" top={50}>
        <Button onPressOut={animate}>
          <ButtonText>trigger animation</ButtonText>
        </Button>
      </View>
      {/* button for testing animation end */}
    </VStack>
  )
})
