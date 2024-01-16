import React, { ComponentRef, useRef } from "react"
import { Screen } from "app/components"

import { TikTokList } from "./TiktokList"
import useFeedManager from "./useFeedManager"

export const Feed = () => {
  const listRef = useRef<ComponentRef<typeof TikTokList>>(null)
  const { feedList, extractKeyFromFeedItem, renderFeedItem, handleCurrentItemInViewChange } =
    useFeedManager({ listRef })

  return (
    <Screen p="$0">
      <TikTokList
        ref={(ref) => {
          if (ref) listRef.current = ref
        }}
        data={feedList}
        keyExtractor={extractKeyFromFeedItem}
        renderItem={renderFeedItem}
        itemContainerProps={{ bgColor: "$blueGray800" }}
        onCurrentItemInViewChange={handleCurrentItemInViewChange}
      />
    </Screen>
  )
}
