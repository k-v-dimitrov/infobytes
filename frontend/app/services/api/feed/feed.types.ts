export interface SubscribeUserToFeed {
  feedUserId: string
}

export enum FeedTypes {
  FEED_FACT = "FEED_FACT",
  FEED_QUESTION = "question",
}

export interface FeedItem<T extends FeedTypes> {
  type: T
}

export interface FeedFact extends FeedItem<FeedTypes.FEED_FACT> {
  categoryType: null | string
  id: string
  sourceUrl: string
  text: string
  title: string
}

// TODO: feed question
