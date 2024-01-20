import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Progress, ProgressFilledTrack, Text, VStack, View } from "@gluestack-ui/themed"
import { useStores } from "app/models"
import Animated, { BounceInLeft, FadeOut } from "react-native-reanimated"
import { getProgressPercentage } from "./utils"
import { useRealtimeManagerContext } from "app/services/realtime-manager"
import { Events } from "app/services/realtime-manager/events"

export const LevelProgressBar = observer(() => {
  const [showAnimation, setShowAnimation] = useState(false)
  const { authenticationStore } = useStores()
  const { level, levelPoints, requiredPointsForNextLevel } = authenticationStore.user

  const progressPercentage = getProgressPercentage(levelPoints, requiredPointsForNextLevel)

  const { addRealtimeListener, removeRealtimeListener } = useRealtimeManagerContext()

  useEffect(() => {
    addRealtimeListener(Events.userChangeInXP, animate)

    return () => {
      removeRealtimeListener(Events.userChangeInXP, animate)
    }
  }, [])

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
                +15
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
    </VStack>
  )
})
