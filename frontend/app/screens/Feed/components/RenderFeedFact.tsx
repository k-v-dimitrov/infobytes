import React from "react"

import { FeedFact } from "app/services/api/feed"
import { useStores } from "app/models"

import { TikTokListRef } from "../TiktokList"
import { VideoPlayer } from "./VideoPlayer"

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

  return (
    isFullyInView && (
      <VideoPlayer
        onEnd={() => {
          if (listRef.current) {
            if (!feedStore.invitedToNextFeedItem) {
              feedStore.setProp("invitedToNextFeedItem", true)
              listRef.current.playInviteToNextItemAnimation()
            }
          }
        }}
        factId={fact.id}
        play
      />
    )
  )
}
