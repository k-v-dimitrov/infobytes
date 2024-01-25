import React, { useState, useLayoutEffect } from "react"

import { FeedFact } from "app/services/api/feed"
import { useStores } from "app/models"

import { TikTokListRef } from "../TiktokList"
import { VideoPlayer } from "./VideoPlayer"
import { getCacheFilePathByName, isFileCached } from "app/utils/fileCache"
import { getFactVideoSourceUrl } from "app/utils/factVideoUrl"

export const RenderFeedFact = ({
  fact,
  isFullyInView,
  listRef,
}: {
  fact: FeedFact
  isFullyInView: boolean
  listRef: TikTokListRef
}) => {
  const { feedStore } = useStores()
  const [isFactVideoCached, setIsFactVideoCached] = useState(false)

  useLayoutEffect(() => {
    ;(async () => {
      const isFactVideoCached = await isFileCached(getCacheFilePathByName(fact.id))
      setIsFactVideoCached(isFactVideoCached)
    })()
  })

  const factVideoUri = isFactVideoCached
    ? getCacheFilePathByName(fact.id)
    : getFactVideoSourceUrl(fact.id)

  return (
    <VideoPlayer
      onEnd={() => {
        if (listRef.current) {
          if (!feedStore.invitedToNextFeedItem) {
            feedStore.setProp("invitedToNextFeedItem", true)
            listRef.current.playInviteToNextItemAnimation()
          }
        }
      }}
      videoFilePath={factVideoUri}
      play={isFullyInView}
    />
  )
}
