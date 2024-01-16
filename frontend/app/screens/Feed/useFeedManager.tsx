import React, { useRef, useEffect, useState, ComponentRef } from "react"
import { Text } from "react-native"
import { autorun } from "mobx"
import { useStores } from "app/models"
import { feedApi, isFeedFact, isFeedQuestion, FeedItem } from "app/services/api/feed"

import { VideoPlayer } from "./VideoPlayer"
import { TikTokList } from "./TiktokList"

const ITEMS_TO_PRELOAD = 2

type TikTokListRef = ReturnType<typeof useRef<ComponentRef<typeof TikTokList>>>

const useFeedManager = ({ listRef }: { listRef: TikTokListRef }) => {
  const { authenticationStore } = useStores()
  const [feedList, setFeedList] = useState<FeedItem[]>([])
  const currentItemIndexInView = useRef<number>(0)

  useEffect(() => {
    autorun(() => {
      const handleFirstFeedEncounter = async () => {
        const { data, error } = await feedApi.subscribeUserToFeed()
        if (error) {
          // TODO: show user error!
          console.warn("Failed getting feed user id!")
          console.warn(data)
        } else {
          authenticationStore.setFeedUserId(data.feedUserId)
        }
      }

      if (!authenticationStore.feedUserId) {
        handleFirstFeedEncounter()
      }
    })
  }, [])

  useEffect(() => {
    autorun(() => {
      if (authenticationStore.feedUserId && feedList.length === 0) {
        pullNextFeedChunk(authenticationStore.feedUserId)
      }
    })
  }, [feedList])

  // TODO: when needed implement this function
  // This will not work because it will shift the indecies of the items and will cause TikTok list to break

  // const freeFeedItemsFromMemory = (threshold = 50, itemsToRemove = 10) => {
  //   if (feedList.length >= threshold) {
  //     setFeedList((prev) => prev.slice(undefined, itemsToRemove))
  //   }
  // }

  const pullNextFeedChunk = async (feedUserId: string) => {
    // freeFeedItemsFromMemory()
    const { data } = await feedApi.getUserFeed(feedUserId)
    setFeedList((prev) => [...prev, ...data])
  }

  const shouldPullNextFeedChunk = (currentViewedIndex: number) => {
    if (currentViewedIndex === feedList.length - 1) {
      return true
    }

    return false
  }

  const shouldRenderFeedItem = (
    currentlyRenderedItemIndex: number,
    currentlyViewedItemIndex: number,
  ) => {
    if (Math.abs(currentlyViewedItemIndex - currentlyRenderedItemIndex) < ITEMS_TO_PRELOAD) {
      return true
    }

    return false
  }

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
    _index,
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

  return { feedList, renderFeedItem, extractKeyFromFeedItem, handleCurrentItemInViewChange }
}

export default useFeedManager
