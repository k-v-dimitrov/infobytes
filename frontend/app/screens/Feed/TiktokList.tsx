import React, {
  ForwardedRef,
  Key,
  useRef,
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react"

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
import { View } from "@gluestack-ui/themed"

const NEXT_ELEMENT_SCROLL_THRESHOLD_PERCENTAGE = 10
const SPRING_ANIM_CONFIG: WithSpringConfig = {
  stiffness: 5,
  mass: 0.025,
}

type TiktokListProps<T> = {
  data: Array<T>
  keyExtractor: (item: T) => Key
  renderItem: ({ item, isFullyInView }: { item: T; isFullyInView: boolean }) => React.ReactNode
  itemContainerProps?: React.ComponentProps<typeof View>
}

type TikTokListRef = ForwardedRef<{
  playInviteToNextItemAnimation: () => void
  scrollToIndex: (index: number) => void
  advanceItem: () => void
  retreatItem: () => void
}>

export function TikTokListInner<T>(props: TiktokListProps<T>, ref: TikTokListRef) {
  const { data, keyExtractor, renderItem, itemContainerProps = {} } = props

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

  const isAnimationPlaying = useRef(false)

  const playAnimation = async (anim: () => Promise<void>) => {
    if (isAnimationPlaying.current) {
      throw new Error(
        "(TikTok List)Tried playing playing animation while another has not finished.",
      )
    }

    isAnimationPlaying.current = true
    await anim()
    isAnimationPlaying.current = false
  }

  const inviteToNextAnim = async () => {
    return new Promise<void>((resolve) => {
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
        withTiming(
          yOffset.value,
          {
            duration: 300,
          },
          () => {
            runOnJS(resolve)()
          },
        ),
      )
    })
  }

  const scrollToIndexAnim = async (itemIndex: number) => {
    return new Promise<void>((resolve, reject) => {
      const absIndex = Math.abs(itemIndex)
      const isNewIndexInBounds = absIndex >= 0 && absIndex <= data.length - 1

      if (isNewIndexInBounds) {
        yOffset.value = withSpring(-(elementHeight * absIndex), SPRING_ANIM_CONFIG, () => {
          runOnJS(handleScrollAnimationEnd)()
          runOnJS(resolve)()
        })
      } else {
        reject(
          new Error(
            `(TikTok List) Item index: (${itemIndex}) is out of bounds in array with length ${data.length}!`,
          ),
        )
      }
    })
  }

  useImperativeHandle(ref, () => ({
    playInviteToNextItemAnimation: () => playAnimation(inviteToNextAnim),
    scrollToIndex: (index: number) => playAnimation(async () => await scrollToIndexAnim(index)),
    advanceItem: () =>
      playAnimation(async () => await scrollToIndexAnim(currentItemIndexInView + 1)),
    retreatItem: () =>
      playAnimation(async () => await scrollToIndexAnim(currentItemIndexInView - 1)),
  }))

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

export const TikTokList = forwardRef(TikTokListInner) as <T>(
  props: TiktokListProps<T> & { ref?: TikTokListRef },
) => ReturnType<typeof TikTokListInner>
