import React, { Key, useRef, useState, useMemo, useEffect } from "react"
import { PanResponder } from "react-native"
import Animated, {
  WithSpringConfig,
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import { View, Text, Spinner, CheckIcon } from "@gluestack-ui/themed"
import { Screen } from "app/components"

const NEXT_ELEMENT_SCROLL_THRESHOLD_PERCENTAGE = 10
const SPRING_ANIM_CONFIG: WithSpringConfig = {
  stiffness: 5,
  mass: 0.025,
}

function TikTokList<T>({
  data,
  keyExtractor,
  renderItem,
  itemContainerProps = {},
  playInviteToNextItemAnimation = false, // TODO: figure out how to invoke animations from parent component in a better manner. forwardRef and useImperativeHandle cannot be used because they break generics
}: {
  data: Array<T>
  keyExtractor: (item: T) => Key
  renderItem: ({ item, isFullyInView }: { item: T; isFullyInView: boolean }) => React.ReactNode
  itemContainerProps?: React.ComponentProps<typeof View>
  playInviteToNextItemAnimation?: boolean
}) {
  const [elementHeight, setElementHeight] = useState(0)
  const yOffset = useSharedValue(0)
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: yOffset.value }],
  }))

  const [currentItemIndexInView, setCurrentItemIndexInView] = useState(0)

  const calcItemIndexInView = () => Math.abs(Math.round(yOffset.value / elementHeight))
  const handleScrollAnimationEnd = () => {
    setCurrentItemIndexInView(calcItemIndexInView())
  }

  const lastDeltaY = useRef(0)
  const onPanStartItemIndex = useRef(0)
  const panResponder = useMemo(() => {
    const handleGrant = () => {
      cancelAnimation(yOffset)
      onPanStartItemIndex.current = Math.round(yOffset.value / elementHeight)
    }

    const handleMove = (_, { dy }) => {
      yOffset.value -= lastDeltaY.current - dy
      lastDeltaY.current = dy
    }

    const handleEnd = () => {
      lastDeltaY.current = 0

      const normalizedOffsetPercentage =
        ((yOffset.value - elementHeight * onPanStartItemIndex.current) / elementHeight) * 100

      const isBackwardScroll = normalizedOffsetPercentage > 0

      if (Math.abs(normalizedOffsetPercentage) >= NEXT_ELEMENT_SCROLL_THRESHOLD_PERCENTAGE) {
        const newIndex = isBackwardScroll
          ? onPanStartItemIndex.current + 1
          : onPanStartItemIndex.current - 1

        const isNewIndexInBounds = -newIndex >= 0 && -newIndex <= data.length - 1

        if (isNewIndexInBounds) {
          yOffset.value = withSpring(elementHeight * newIndex, SPRING_ANIM_CONFIG, () =>
            runOnJS(handleScrollAnimationEnd)(),
          )
          return
        }
      }

      yOffset.value = withSpring(elementHeight * onPanStartItemIndex.current, SPRING_ANIM_CONFIG)
    }

    return PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: handleGrant,
      onPanResponderMove: handleMove,
      onPanResponderEnd: handleEnd,
    })
  }, [elementHeight, handleScrollAnimationEnd])

  const inviteToNextItemAnimationPlayed = useRef(false)
  if (playInviteToNextItemAnimation && !inviteToNextItemAnimationPlayed.current) {
    yOffset.value = withSequence(
      withTiming(yOffset.value - 50, {
        duration: 300,
      }),
      withTiming(yOffset.value, {
        duration: 300,
      }),
      withTiming(yOffset.value - 50, {
        duration: 300,
      }),
      withTiming(yOffset.value, {
        duration: 300,
      }),
    )

    inviteToNextItemAnimationPlayed.current = true
  }

  return (
    <View flex={1} {...panResponder.panHandlers}>
      {data.map((item, index) => (
        <View key={keyExtractor(item)}>
          <Animated.View style={animatedStyles}>
            <View
              onLayout={(e) => {
                const viewHeight = e.nativeEvent.layout.height
                setElementHeight(viewHeight)
              }}
              height="$full"
              {...itemContainerProps}
            >
              {renderItem({ item, isFullyInView: currentItemIndexInView === index })}
            </View>
          </Animated.View>
        </View>
      ))}
    </View>
  )
}

export const Feed = () => {
  const [playNextItemAnimation, setPlayNextItemAnimation] = useState(false)

  useEffect(() => {
    const tId = setTimeout(() => {
      setPlayNextItemAnimation(true)
    }, 5000)

    return () => clearTimeout(tId)
  }, [])

  return (
    <Screen p="$0">
      <TikTokList
        data={["test", "test 2", "test 3", "test 4", "test 5"]}
        playInviteToNextItemAnimation={playNextItemAnimation}
        keyExtractor={(item) => item}
        renderItem={({ item, isFullyInView }) => {
          return (
            // This item can have flex={1} and it will be height 100%
            <View flex={1} borderColor="$green100" borderWidth={1}>
              <Text>{item}</Text>
              <View
                flex={1}
                borderColor="$amber400"
                borderWidth={1}
                alignContent="center"
                justifyContent="center"
                alignItems="center"
              >
                {isFullyInView ? (
                  <CheckIcon size="xl" color="$green400" />
                ) : (
                  <Spinner size={"large"} />
                )}
              </View>
            </View>
          )
        }}
        itemContainerProps={{ bgColor: "$blueGray800" }}
      />
    </Screen>
  )
}
