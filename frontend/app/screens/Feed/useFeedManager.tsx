import React, { useRef, useEffect, useState, ComponentRef } from "react"
import { Text } from "react-native"
import { autorun } from "mobx"
import { useStores } from "app/models"
import {
  feedApi,
  FeedItem,
  processFeedItem,
  FeedTypes,
  FeedFact,
  FeedQuestion,
} from "app/services/api/feed"

import { VideoPlayer } from "./VideoPlayer"
import { TikTokList } from "./TiktokList"

const ITEMS_TO_LOAD = 2
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

  const pullNextFeedChunk = async (feedUserId: string) => {
    const { data } = await feedApi.getUserFeed(feedUserId, ITEMS_TO_LOAD)
    setFeedList((prev) => [...prev, ...data])
  }

  const shouldPullNextFeedChunk = (currentViewedIndex: number) => {
    if (currentViewedIndex === feedList.length - 1) {
      return true
    }

    return false
  }

  // const shouldRenderFeedItem = (
  //   currentlyRenderedItemIndex: number,
  //   currentlyViewedItemIndex: number,
  // ) => {
  //   if (Math.abs(currentlyViewedItemIndex - currentlyRenderedItemIndex) < ITEMS_TO_PRELOAD) {
  //     return true
  //   }

  //   return false
  // }

  const handleCurrentItemInViewChange = (itemIndex: number) => {
    if (shouldPullNextFeedChunk(itemIndex)) {
      pullNextFeedChunk(authenticationStore.feedUserId)
    }
    currentItemIndexInView.current = itemIndex
  }

  const extractKeyFromFeedItem = (feedItem: FeedItem) =>
    processFeedItem(feedItem, {
      [FeedTypes.FEED_FACT]: (item: FeedFact) => {
        return item.id
      },
      [FeedTypes.FEED_QUESTION]: (item: FeedQuestion) => {
        return item.data.id
      },
    })

  const renderFeedItem = ({
    item,
    index: _index,
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

    return processFeedItem(item, {
      [FeedTypes.FEED_FACT]: (fact: FeedFact) => {
        return (
          isFullyInView && (
            <VideoPlayer
              onEnd={() => {
                if (listRef.current) {
                  listRef.current.playInviteToNextItemAnimation()
                }
              }}
              factId={fact.id}
              play
            />
          )
        )
      },
      [FeedTypes.FEED_QUESTION]: (_question: FeedQuestion) => {
        return <Text>QUestion</Text>
      },
    })
  }

  return { feedList, renderFeedItem, extractKeyFromFeedItem, handleCurrentItemInViewChange }
}

export default useFeedManager
