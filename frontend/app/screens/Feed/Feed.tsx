import React, { ComponentRef, useRef, useEffect, useState } from "react"
import { View, Text, Spinner, CheckIcon } from "@gluestack-ui/themed"
import { observer } from "mobx-react-lite"
import { Screen } from "app/components"
import { TikTokList } from "./TiktokList"
import { VideoPlayer } from "./VideoPlayer"
import { feedApi } from "app/services/api/feed"
import { useStores } from "app/models"
import useFeedManager from "./useFeedManager"

export const Feed = observer<any>(() => {
  const { feedList, pullNextFeedChunk, shouldPullNextFeedChunk, shouldRenderFeedItem } =
    useFeedManager()
  const { authenticationStore } = useStores()

  const currentItemIndexInView = useRef<number>(-1)

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

  const handleCurrentItemInViewChange = (itemIndex: number) => {
    if (shouldPullNextFeedChunk(itemIndex)) {
      pullNextFeedChunk(authenticationStore.feedUserId)
    }

    currentItemIndexInView.current = itemIndex
  }

  return (
    <Screen p="$0">
      <TikTokList
        data={feedList}
        keyExtractor={({ id }) => id}
        renderItem={({ item, index, isFullyInView }) => {
          // if (!shouldRenderFeedItem(index, currentItemIndexInView.current)) {
          //   return null
          // }

          return (
            <View flex={1}>
              <VideoPlayer />
            </View>
          )
        }}
        itemContainerProps={{ bgColor: "$blueGray800" }}
        onCurrentItemInViewChange={handleCurrentItemInViewChange}
      />
      {/* <VideoPlayer /> */}
    </Screen>
  )
})
