import React from "react"

import { FeedFact } from "app/services/api/feed"

import { VideoPlayer } from "./VideoPlayer"

import { TikTokListRef } from "../TiktokList"
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
