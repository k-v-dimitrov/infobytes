import { useRef, useEffect, useState } from "react"
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

const ITEMS_TO_LOAD = 2

const useItemIdTracker = () => {
  // Helper map to track occurances during rendering to assign to item keys
  const renderTracker = useRef<Record<string, number>>({})

  const getCurrentOcurrancesForItem = (id: string) => {
    let currentOccurances = 0
    if (!isNaN(renderTracker.current[id])) {
      renderTracker.current[id] += 1
      currentOccurances = renderTracker.current[id]
    } else {
      renderTracker.current[id] = 0
    }
    return currentOccurances
  }
  // Reset render tracker after every render
  useEffect(() => () => {
    renderTracker.current = {}
  })

  return { getCurrentOcurrancesForItem }
}

const useFeedManager = () => {
  const { authenticationStore, feedStore } = useStores()
  const [feedList, setFeedList] = useState<FeedItem[]>([])
  const currentItemIndexInView = useRef<number>(0)
  const { getCurrentOcurrancesForItem } = useItemIdTracker()

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
    const processedFeedItems = preProcessFeedItems(data)
    setFeedList((prev) => [...prev, ...processedFeedItems])
  }

  const preProcessFeedItems = (feedItems: FeedItem[]) => {
    feedItems.forEach(resetAlreadyAnsweredQuestion)
    return feedItems // can also alter feed items if needed, e.g. feedItems.map(processFunction)
  }

  const resetAlreadyAnsweredQuestion = (feedItem: FeedItem) =>
    processFeedItem(feedItem, {
      [FeedTypes.FEED_FACT]: () => undefined,
      [FeedTypes.FEED_QUESTION]: ({ data: { id } }: FeedQuestion) => {
        feedStore.removeAnsweredQuestion(id)
      },
    })

  const shouldPullNextFeedChunk = (currentViewedIndex: number) => {
    if (currentViewedIndex === feedList.length - 1) {
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

  const extractKeyFromFeedItem = (feedItem: FeedItem) =>
    processFeedItem(feedItem, {
      [FeedTypes.FEED_FACT]: (fact: FeedFact) => {
        return `${fact.id} - ${getCurrentOcurrancesForItem(fact.id)}`
      },
      [FeedTypes.FEED_QUESTION]: (question: FeedQuestion) => {
        return `${question.data.id} - ${getCurrentOcurrancesForItem(question.data.id)}`
      },
    })

  return { feedList, extractKeyFromFeedItem, handleCurrentItemInViewChange }
}

export default useFeedManager
