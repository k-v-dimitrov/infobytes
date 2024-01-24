import { Box, Button, ButtonIcon, CheckIcon, Heading, Text } from "@gluestack-ui/themed"
import React, { useState } from "react"
import { Directions, Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"

const BUTTON_WIDTH = 150

export const SwipeableFact = () => {
  const [isButtonVisible, setIsButtonVisible] = useState(false)
  const position = useSharedValue(0)

  const leftSwipe = Gesture.Fling()
    .direction(Directions.LEFT)
    .onStart(() => {
      position.value = withTiming(position.value - BUTTON_WIDTH, { duration: 100 })
      runOnJS(setIsButtonVisible)(true)
    })

  const rightSwipe = Gesture.Fling()
    .direction(Directions.RIGHT | Directions.LEFT)
    .onStart(() => {
      position.value = withTiming(position.value + BUTTON_WIDTH, { duration: 100 })
      runOnJS(setIsButtonVisible)(false)
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }))

  return (
    <GestureDetector gesture={isButtonVisible ? rightSwipe : leftSwipe}>
      <Animated.View style={animatedStyle}>
        <Box position="relative" p="$2" borderBottomWidth="$1" borderColor="$warmGray100">
          <Heading textTransform="uppercase">#Heading</Heading>
          <Heading size="md">Heading md</Heading>
          <Text isTruncated={true}>
            Text Text Text Text Text Text Text Text Text Text Text Text Text
          </Text>

          <Button
            borderRadius="$none"
            position="absolute"
            action="positive"
            height="$full"
            width={BUTTON_WIDTH}
            left={"105%"}
            top={"$4"}
          >
            <ButtonIcon as={CheckIcon} h="$8" w="$8" />
          </Button>
        </Box>
      </Animated.View>
    </GestureDetector>
  )
}
