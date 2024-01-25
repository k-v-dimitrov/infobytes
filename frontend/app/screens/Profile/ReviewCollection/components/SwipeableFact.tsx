import React, { useState } from "react"
import { Box, Button, ButtonIcon, CheckIcon, Heading, Pressable, Text } from "@gluestack-ui/themed"
import { Directions, Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  FadeOut,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated"
import { useApi } from "app/hooks"
import { navigate } from "app/navigators"
import { FactForReview, factApi } from "app/services/api"

const BUTTON_WIDTH = 150

interface Props {
  fact: FactForReview
  onRemoveSuccess: (factId: string) => void
}

export const SwipeableFact = ({ fact, onRemoveSuccess }: Props) => {
  const { id, categoryType, title, text } = fact
  const { trigger } = useApi(factApi.deleteFactForReview, {
    props: [id],
    executeOnMount: false,
    onSuccess: () => onRemoveSuccess(id),
  })
  const [isButtonVisible, setIsButtonVisible] = useState(false)
  const position = useSharedValue(0)
  const opacity = useSharedValue(1)

  const handleOnPress = () => {
    navigate({ name: "FactVideo", params: fact })
  }

  const leftSwipe = Gesture.Fling()
    .direction(Directions.LEFT)
    .onStart(() => {
      position.value = withTiming(position.value - BUTTON_WIDTH, { duration: 100 })
      runOnJS(setIsButtonVisible)(true)
    })

  const doubleLeftSwipe = Gesture.Fling()
    .direction(Directions.LEFT)
    .onStart(() => {
      position.value = withDelay(100, withTiming(-1000, { duration: 100 }))
      opacity.value = withTiming(0, { duration: 100 })

      runOnJS(trigger)()
    })

  const rightSwipe = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onStart(() => {
      position.value = withTiming(position.value + BUTTON_WIDTH, { duration: 100 })
      runOnJS(setIsButtonVisible)(false)
    })

  const composed = Gesture.Exclusive(doubleLeftSwipe, rightSwipe)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
    opacity: opacity.value,
  }))

  return (
    <GestureDetector gesture={isButtonVisible ? composed : leftSwipe}>
      <Pressable delayLongPress={80} onPress={handleOnPress}>
        <Animated.View style={animatedStyle} exiting={FadeOut}>
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
              onPress={trigger}
            >
              <ButtonIcon as={CheckIcon} h="$8" w="$8" />
            </Button>
          </Box>
        </Animated.View>
      </Pressable>
    </GestureDetector>
  )
}
