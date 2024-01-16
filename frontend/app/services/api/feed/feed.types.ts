export interface SubscribeUserToFeed {
  feedUserId: string
}

export enum FeedTypes {
  FEED_FACT = "FEED_FACT",
  FEED_QUESTION = "FEED_QUESTION",
}

export interface FeedItem {
  type: FeedTypes
}

export interface FeedFact extends FeedItem {
  categoryType: null | string
  id: string
  sourceUrl: string
  text: string
  title: string
}

export function isFeedFact(obj: FeedItem): obj is FeedFact {
  return obj.type === FeedTypes.FEED_FACT
}

export interface FeedQuestion extends FeedItem {
  data: QuestionData
}

export interface QuestionData {
  id: string
  questionText: string
  answers: Answer[]
  answerURI: string
}

export interface Answer {
  id: string
  text: string
}

export function isFeedQuestion(obj: FeedItem): obj is FeedQuestion {
  return obj.type === FeedTypes.FEED_QUESTION
}

export function processFeedItem<T>(
  obj: FeedItem,
  handlers: { [key in FeedTypes]: (feedItem: FeedItem) => T },
): T {
  const currentObjType = obj.type

  if (!Object.values(FeedTypes).includes(currentObjType)) {
    console.warn(`Encountered unknown Feed Item Type: ${currentObjType}`)
    return null
  }

  if (!Object.keys(handlers).includes(currentObjType)) {
    console.log(`No handler provided for Feed Item of Type: ${currentObjType}`)
  }

  return handlers?.[currentObjType](obj as FeedFact | FeedQuestion)
}
