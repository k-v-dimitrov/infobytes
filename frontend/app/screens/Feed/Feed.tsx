import React, { ComponentRef, useRef } from "react"
import { observer } from "mobx-react-lite"
import { Screen } from "app/components"
import { TikTokList } from "./TiktokList"
import { VideoPlayer } from "./VideoPlayer"
import { useStores } from "app/models"
import useFeedManager from "./useFeedManager"

export const Feed = observer<any>(() => {
  const { feedList, pullNextFeedChunk, shouldPullNextFeedChunk } = useFeedManager()
  const { authenticationStore } = useStores()

  const currentItemIndexInView = useRef<number>(0)
  const listRef = useRef<ComponentRef<typeof TikTokList>>(null)

  const handleCurrentItemInViewChange = (itemIndex: number) => {
    if (shouldPullNextFeedChunk(itemIndex)) {
      pullNextFeedChunk(authenticationStore.feedUserId)
    }
    currentItemIndexInView.current = itemIndex
  }

  return (
    <Screen p="$0">
      <TikTokList
        ref={(ref) => {
          if (ref) listRef.current = ref
        }}
        data={feedList}
        keyExtractor={({ id }) => id}
        renderItem={({ item, index, isFullyInView }) => {
          // TODO: check calculation of currentItemIndexInView
          // if (!shouldRenderFeedItem(index, currentItemIndexInView.current)) {
          //   return null
          // }
          if (isFullyInView)
            return (
              <VideoPlayer
                onEnd={() => {
                  if (listRef.current) {
                    listRef.current.playInviteToNextItemAnimation()
                  }
                }}
                factId={item.id}
                play={isFullyInView}
              />
            )
        }}
        itemContainerProps={{ bgColor: "$blueGray800" }}
        onCurrentItemInViewChange={handleCurrentItemInViewChange}
      />
    </Screen>
  )
})
