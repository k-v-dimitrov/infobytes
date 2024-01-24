import { Box, Button, ButtonIcon, CheckIcon, Heading, Text } from "@gluestack-ui/themed"
import { useApi } from "app/hooks"
import { navigate } from "app/navigators"
import { FactForReview, factApi } from "app/services/api"
import React, { useState } from "react"
import { Directions, Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated"

const BUTTON_WIDTH = 150

interface Props {
  fact: FactForReview
}

export const SwipeableFact = ({ fact }: Props) => {
  const { id, categoryType, title, text } = fact
  const { trigger } = useApi(factApi.deleteFactForReview, {
    props: [id],
    executeOnMount: false,
  })
  const [isButtonVisible, setIsButtonVisible] = useState(false)
  const position = useSharedValue(0)
  const opacity = useSharedValue(1)

  const tap = Gesture.Tap()
    .onStart(() => {
      opacity.value = withTiming(0.3, { duration: 100 })
      runOnJS(navigate)({ name: "FactVideo", params: fact })
    })
    .onEnd(() => {
      opacity.value = withDelay(100, withTiming(1, { duration: 100 }))
    })

  const leftSwipe = Gesture.Fling()
    .direction(Directions.LEFT)
    .onStart(() => {
      position.value = withTiming(position.value - BUTTON_WIDTH, { duration: 100 })
      runOnJS(setIsButtonVisible)(true)
    })

  const composed1 = Gesture.Exclusive(tap, leftSwipe)

  const doubleLeftSwipe = Gesture.Fling()
    .direction(Directions.LEFT)
    .onStart(() => {
      position.value = withTiming(-1000, { duration: 100 })
      opacity.value = withTiming(0, { duration: 100 })
    })

  const rightSwipe = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onStart(() => {
      position.value = withTiming(position.value + BUTTON_WIDTH, { duration: 100 })
      runOnJS(setIsButtonVisible)(false)
    })

  const composed2 = Gesture.Exclusive(doubleLeftSwipe, rightSwipe)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
    opacity: opacity.value,
  }))

  return (
    <GestureDetector  gesture={isButtonVisible ? composed2 : composed1}>
      <Animated.View style={animatedStyle}>
        <Box position="relative" p="$2" borderBottomWidth="$1" borderColor="$warmGray100">
          <Heading textTransform="uppercase">#{categoryType}</Heading>
          <Heading size="md">{title}</Heading>
          <Text isTruncated={true}>{text} </Text>

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
