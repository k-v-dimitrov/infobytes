import React, { Key, useRef, useState, useMemo } from "react"
import { PanResponder } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import { View, Text } from "@gluestack-ui/themed"
import { Screen } from "app/components"

const NEXT_ELEMENT_SCROLL_THRESHOLD_PERCENTAGE = 35

function CustomVirtualizedList<T>({
  data,
  keyExtractor,
  renderItem,
  itemContainerProps = {},
}: {
  data: Array<T>
  keyExtractor: (item: T) => Key
  renderItem: (item: T) => React.ReactNode
  itemContainerProps?: React.ComponentProps<typeof View>
}) {
  const [elementHeight, setElementHeight] = useState(0)
  const [bottomBoundary, setBottomBoundary] = useState(0)

  const yOffset = useSharedValue(0)

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: yOffset.value }],
  }))

  const lastDy = useRef(0)
  const onPanStartIndex = useRef(0)
  const panResponder = useMemo(() => {
    const handleGrant = () => {
      onPanStartIndex.current = Math.round(yOffset.value / elementHeight)
    }

    const handleMove = (_, { dy }) => {
      yOffset.value -= lastDy.current - dy
      lastDy.current = dy
    }

    const handleEnd = () => {
      lastDy.current = 0

      const normalizedOffsetPercentage =
        ((yOffset.value - elementHeight * onPanStartIndex.current) / elementHeight) * 100

      const isBackwardScroll = normalizedOffsetPercentage > 0

      if (Math.abs(normalizedOffsetPercentage) >= NEXT_ELEMENT_SCROLL_THRESHOLD_PERCENTAGE) {
        const newIndex = isBackwardScroll
          ? onPanStartIndex.current + 1
          : onPanStartIndex.current - 1

        const isNewIndexInBounds = -newIndex >= 0 && -newIndex <= data.length - 1

        if (isNewIndexInBounds) {
          yOffset.value = withSpring(elementHeight * newIndex)
          return
        }
      }

      yOffset.value = withSpring(elementHeight * onPanStartIndex.current)
    }

    return PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: handleGrant,
      onPanResponderMove: handleMove,
      onPanResponderEnd: handleEnd,
    })
  }, [elementHeight])

  return (
    <View flex={1} {...panResponder.panHandlers}>
      {data.map((item) => (
        <View key={keyExtractor(item)}>
          <Animated.View style={[animatedStyles, { height: "100%" }]}>
            <View
              onLayout={(e) => {
                const viewHeight = e.nativeEvent.layout.height
                setElementHeight(viewHeight)
                setBottomBoundary(viewHeight * data.length)
              }}
              height="$full"
              {...itemContainerProps}
            >
              {renderItem(item)}
            </View>
          </Animated.View>
        </View>
      ))}

      {/* <Animated.View style={[animatedStyles]}>
        <View height={10} width={10} bgColor="$red100"></View>
      </Animated.View> */}
    </View>
  )
}

export const Feed = () => {
  return (
    <Screen p="$0">
      <CustomVirtualizedList
        data={["test", "test 2", "test 3", "test 4", "test 5"]}
        keyExtractor={(item) => item}
        renderItem={(item) => {
          return (
            <View borderColor="$green100" borderWidth={3}>
              <Text>{item}</Text>
            </View>
          )
        }}
        itemContainerProps={{ bgColor: "$blueGray800" }}
      />
    </Screen>
  )
}
