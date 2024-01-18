/* eslint-disable react-native/no-inline-styles */
import React, { ComponentRef, useRef } from "react"

import { Screen } from "app/components"
import { FeedFact, FeedQuestion, FeedItem, processFeedItem, FeedTypes } from "app/services/api/feed"

import { RenderFeedFact } from "./components/RenderFeedFact"
import { RenderFeedQuestion } from "./components/RenderFeedQuestion"

import useFeedManager from "./useFeedManager"
import { TikTokList, TikTokListRef } from "./TiktokList"
import { useHeaderToolbar } from "app/utils/useHeaderToolbar"

const renderFeedItem = ({
  item,
  isFullyInView,
  listRef,
  topInset,
}: {
  item: FeedItem
  index: number
  isFullyInView: boolean
  listRef: TikTokListRef
  topInset?: number
}) => {
  return processFeedItem(item, {
    [FeedTypes.FEED_FACT]: (fact: FeedFact) => (
      <RenderFeedFact fact={fact} isFullyInView={isFullyInView} listRef={listRef} />
    ),
    [FeedTypes.FEED_QUESTION]: (question: FeedQuestion) => (
      <RenderFeedQuestion question={question} isFullyInView={isFullyInView} topInset={topInset} />
    ),
  })
}

export const Feed = () => {
  const { topInset } = useHeaderToolbar()
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
        renderItem={(props) => renderFeedItem({ ...props, listRef, topInset })}
        itemContainerProps={{ bgColor: "$blueGray800" }}
        onCurrentItemInViewChange={handleCurrentItemInViewChange}
      />
    </Screen>
  )
}
