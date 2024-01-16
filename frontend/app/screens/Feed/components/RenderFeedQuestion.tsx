/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react"
import { View, VStack, Heading } from "@gluestack-ui/themed"
import LottieView from "lottie-react-native"

import {
  Answer,
  FeedQuestion,
  feedApi,
  isCorrectAnswerResponse,
  isWrongAnswerResponse,
} from "app/services/api/feed"

import { QuizButton } from "./QuizButton"

import QuizAppearAnim from "../../../../assets/lottie/quiz-appear.json"
import { useApi } from "app/hooks"

export const RenderFeedQuestion = ({
  question,
  isFullyInView,
}: {
  question: FeedQuestion
  isFullyInView: boolean
}) => {
  const [animFinished, setAnimFinished] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null)
  const [correctAnswerId, setCorrectAnswerId] = useState(null)

  const {
    trigger: answerQuestion,
    error,
    loading,
  } = useApi(feedApi.answerFeedQuestion, {
    executeOnMount: false,
    props: [{ answerId: selectedAnswer?.id, questionUri: question.data.answerURI }],
    onSuccess: (answerResponse) => {
      if (isCorrectAnswerResponse(answerResponse)) {
        setCorrectAnswerId(selectedAnswer.id)
      }

      if (isWrongAnswerResponse(answerResponse)) {
        setCorrectAnswerId(answerResponse.correctAnswerId)
      }

      if (!isCorrectAnswerResponse(answerResponse) && !isWrongAnswerResponse(answerResponse)) {
        console.warn("Unknown data for answer response: ", answerResponse)
      }
    },
    onError: () => {
      // TODO: Show error to user
      console.warn(error)
    },
  })

  const handleSelectedAnswer = (answer: Answer) => () => {
    if (!selectedAnswer) {
      setSelectedAnswer(answer)
    }
  }

  // Trigger api call
  useEffect(() => {
    if (selectedAnswer) {
      answerQuestion()
    }
  }, [selectedAnswer])

  // Quiz animation useEffect
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
              <QuizButton
                key={answer.id}
                text={answer.text}
                onClick={handleSelectedAnswer(answer)}
                isWrong={
                  correctAnswerId &&
                  selectedAnswer.id === answer.id &&
                  answer.id !== correctAnswerId
                }
                isCorrect={correctAnswerId && answer.id === correctAnswerId}
                isLoading={loading}
              />
            ))}
          </VStack>
        </>
      )}
    </View>
  )
}
