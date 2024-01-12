import React, { ComponentRef, useRef, useEffect } from "react"
import { View, Text, Spinner, CheckIcon } from "@gluestack-ui/themed"
import { Screen } from "app/components"
import { TikTokList } from "./TiktokList"
import Test from "./test"

export const Feed = () => {
  // const listRef = useRef<ComponentRef<typeof TikTokList>>(null)

  // // Example of TikTok built-in animations
  // useEffect(() => {
  //   const tId = setTimeout(() => {
  //     if (listRef) {
  //       listRef.current.advanceItem()
  //     }
  //   }, 2000)

  //   const t2Id = setTimeout(() => {
  //     if (listRef) {
  //       listRef.current.playInviteToNextItemAnimation()
  //     }
  //   }, 3500)

  //   return () => {
  //     clearTimeout(tId)
  //     clearTimeout(t2Id)
  //   }
  // }, [])

  return (
    <Screen p="$0">
      {/* <TikTokList
        ref={(ref) => {
          listRef.current = ref
        }}
        data={["test", "test 2", "test 3", "test 4", "test 5"]}
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
      /> */}
      <Test />
    </Screen>
  )
}
