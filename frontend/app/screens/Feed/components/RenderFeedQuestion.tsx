/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react"
import { View, VStack, Heading } from "@gluestack-ui/themed"
import LottieView from "lottie-react-native"

import { FeedQuestion } from "app/services/api/feed"
import QuizAppearAnim from "../../../../assets/lottie/quiz-appear.json"

import { QuizButton } from "./QuizButton"

export const RenderFeedQuestion = ({
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
