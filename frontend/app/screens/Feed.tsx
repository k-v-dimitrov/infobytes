import React, { Key, useRef, useState } from "react"
import { View, Text } from "@gluestack-ui/themed"
import { Screen } from "app/components"
import { PanResponder } from "react-native"
import { TranslateYTransform } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated"

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
  const [height, setHeight] = useState(0)
  const [bottomBoundary, setBottomBoundary] = useState(0)

  const yOffset = useSharedValue(0)

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: yOffset.value }],
  }))

  const lastDy = useRef(0)
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, { dy }) => {
        yOffset.value -= lastDy.current - dy
        lastDy.current = dy
      },
      onPanResponderEnd: (_, { dy }) => {
        lastDy.current = 0
      },
    }),
  ).current

  return (
    <View flex={1} {...panResponder.panHandlers}>
      {data.map((item) => (
        <View key={keyExtractor(item)} borderWidth={4} borderColor="red">
          <Animated.View style={[animatedStyles, { height: "100%" }]}>
            <View
              onLayout={(e) => {
                const viewHeight = e.nativeEvent.layout.height
                setHeight(viewHeight)
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
        data={["test", "test 2"]}
        keyExtractor={(item) => item}
        renderItem={(item) => {
          return <View borderColor="$green100" borderWidth={3}></View>
        }}
        itemContainerProps={{ bgColor: "$blueGray800" }}
      />
    </Screen>
  )
}
