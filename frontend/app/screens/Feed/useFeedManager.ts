import { useStores } from "app/models"
import { feedApi } from "app/services/api/feed"
import { autorun } from "mobx"
import { useEffect, useState } from "react"

const ITEMS_TO_PRELOAD = 2

const useFeedManager = () => {
  const { authenticationStore } = useStores()
  const [feedList, setFeedList] = useState([])

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

  return { feedList, pullNextFeedChunk, shouldPullNextFeedChunk, shouldRenderFeedItem }
}

export default useFeedManager
