import React from "react"

import { FeedFact } from "app/services/api/feed"
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
}) =>
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
