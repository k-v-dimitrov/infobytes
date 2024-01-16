/* eslint-disable react-native/no-inline-styles */
import React, { ComponentRef, useEffect, useRef, useState } from "react"
import { View, VStack, Heading } from "@gluestack-ui/themed"
import { Screen } from "app/components"
import LottieView from "lottie-react-native"

import { TikTokList } from "./TiktokList"
import useFeedManager from "./useFeedManager"
import { FeedFact, FeedQuestion, FeedItem, processFeedItem, FeedTypes } from "app/services/api/feed"
import { VideoPlayer } from "./VideoPlayer"
import { QuizButton } from "./components/QuizButton"

import QuizAppearAnim from "../../../assets/lottie/quiz-appear.json"

type TikTokListRef = ReturnType<typeof useRef<ComponentRef<typeof TikTokList>>>

const RenderFact = ({
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

const RenderQuestion = ({
  question,
  isFullyInView,
}: {
  question: FeedQuestion
  isFullyInView: boolean
}) => {
  const [animFinished, setAnimFinished] = useState(false)

  useEffect(() => {
    let tId = null

    if (isFullyInView && !animFinished) {
      tId = setTimeout(() => setAnimFinished(true), 1000)
    }

    return () => clearTimeout(tId)
  }, [isFullyInView])

  return (
    <View p="$10" alignItems="center" flex={1} borderWidth={3} gap="$16">
      {!animFinished ? (
        <View flex={1} width="$full">
          <LottieView resizeMode="contain" source={QuizAppearAnim} autoPlay style={{ flex: 1 }} />
        </View>
      ) : (
        <>
          <VStack alignItems="center">
            <Heading size="xl" textAlign="center" lineHeight="$lg">
              {question.data.questionText}
            </Heading>
          </VStack>

          <VStack gap="$2" flex={1}>
            {question.data.answers.map((answer) => (
              <QuizButton key={answer.id} text={answer.text} />
            ))}
          </VStack>
        </>
      )}
    </View>
  )
}

const renderFeedItem = ({
  item,
  isFullyInView,
  listRef,
}: {
  item: FeedItem
  index: number
  isFullyInView: boolean
  listRef: TikTokListRef
}) => {
  return processFeedItem(item, {
    [FeedTypes.FEED_FACT]: (fact: FeedFact) => (
      <RenderFact fact={fact} isFullyInView={isFullyInView} listRef={listRef} />
    ),
    [FeedTypes.FEED_QUESTION]: (question: FeedQuestion) => (
      <RenderQuestion question={question} isFullyInView={isFullyInView} />
    ),
  })
}

export const Feed = () => {
  const listRef = useRef<ComponentRef<typeof TikTokList>>(null)
  const { feedList, extractKeyFromFeedItem, handleCurrentItemInViewChange } = useFeedManager()

  return (
    <Screen p="$0">
      <TikTokList
        ref={(ref) => {
          if (ref) listRef.current = ref
        }}
        data={feedList}
        keyExtractor={extractKeyFromFeedItem}
        renderItem={(props) => renderFeedItem({ ...props, listRef })}
        itemContainerProps={{ bgColor: "$blueGray800" }}
        onCurrentItemInViewChange={handleCurrentItemInViewChange}
      />
    </Screen>
  )
}
