/* eslint-disable react-native/no-inline-styles */
import React, { ComponentRef, useRef } from "react"
import { Screen } from "app/components"

import { FeedFact, FeedQuestion, FeedItem, processFeedItem, FeedTypes } from "app/services/api/feed"

import { RenderFeedFact } from "./components/RenderFeedFact"
import { RenderFeedQuestion } from "./components/RenderFeedQuestion"

import { TikTokList, TikTokListRef } from "./TiktokList"
import useFeedManager from "./useFeedManager"

const renderFeedItem = ({
  item,
  isFullyInView,
  listRef,
}: {
  item: FeedItem
  index: number
  isFullyInView: boolean
  listRef: TikTokListRef
}) => {
  return processFeedItem(item, {
    [FeedTypes.FEED_FACT]: (fact: FeedFact) => (
      <RenderFeedFact fact={fact} isFullyInView={isFullyInView} listRef={listRef} />
    ),
    [FeedTypes.FEED_QUESTION]: (question: FeedQuestion) => (
      <RenderFeedQuestion question={question} isFullyInView={isFullyInView} />
    ),
  })
}

export const Feed = () => {
  const listRef = useRef<ComponentRef<typeof TikTokList>>(null)
  const { feedList, extractKeyFromFeedItem, handleCurrentItemInViewChange } = useFeedManager()

  return (
    <Screen p="$0">
      <TikTokList
        ref={(ref) => {
          if (ref) listRef.current = ref
        }}
        data={feedList}
        keyExtractor={extractKeyFromFeedItem}
        renderItem={(props) => renderFeedItem({ ...props, listRef })}
        itemContainerProps={{ bgColor: "$blueGray800" }}
        onCurrentItemInViewChange={handleCurrentItemInViewChange}
      />
    </Screen>
  )
}
