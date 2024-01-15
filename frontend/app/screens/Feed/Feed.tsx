import React, { ComponentRef, useRef } from "react"
import { Text } from "react-native"
import { observer } from "mobx-react-lite"
import { Screen } from "app/components"
import { TikTokList } from "./TiktokList"
import { VideoPlayer } from "./VideoPlayer"
import { useStores } from "app/models"
import useFeedManager from "./useFeedManager"
import { isFeedFact, isFeedQuestion, FeedItem } from "app/services/api/feed"

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

  const extractKeyFromFeedItem = (feedItem: FeedItem) => {
    if (isFeedFact(feedItem)) {
      const feedFact = feedItem
      return feedFact.id
    }

    if (isFeedQuestion(feedItem)) {
      const feedQuestion = feedItem
      return feedQuestion.data.id
    }

    console.warn("Unknown feed item was encountered:", feedItem)

    return null
  }

  const renderFeedItem = ({
    item,
    index,
    isFullyInView,
  }: {
    item: FeedItem
    index: number
    isFullyInView: boolean
  }) => {
    // TODO: check calculation of currentItemIndexInView
    // if (!shouldRenderFeedItem(index, currentItemIndexInView.current)) {
    //   return null
    // }

    if (isFullyInView) {
      if (isFeedFact(item)) {
        const feedFact = item

        return (
          <VideoPlayer
            onEnd={() => {
              if (listRef.current) {
                listRef.current.playInviteToNextItemAnimation()
              }
            }}
            factId={feedFact.id}
            play
          />
        )
      }

      if (isFeedQuestion(item)) {
        return <Text>Feed Qustion!</Text>
      }

      console.warn("Uknown feed item was encountered:", item)
    }

    return null
  }

  return (
    <Screen p="$0">
      <TikTokList
        ref={(ref) => {
          if (ref) listRef.current = ref
        }}
        data={feedList}
        keyExtractor={extractKeyFromFeedItem}
        renderItem={renderFeedItem}
        itemContainerProps={{ bgColor: "$blueGray800" }}
        onCurrentItemInViewChange={handleCurrentItemInViewChange}
      />
    </Screen>
  )
})
