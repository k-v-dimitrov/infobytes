/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from "react"
import { View, VStack, Heading } from "@gluestack-ui/themed"
import LottieView from "lottie-react-native"

import {
  Answer,
  FeedQuestion,
  feedApi,
  isCorrectAnswerResponse,
  isWrongAnswerResponse,
} from "app/services/api/feed"
import { useApi } from "app/hooks"

import { TikTokListRef } from "../TiktokList"
import { QuizButton } from "./QuizButton"

import QuizAppearAnim from "../../../../assets/lottie/quiz-appear.json"
import GoodJobAnim from "../../../../assets/lottie/good-job.json"

interface RenderFeedQuestonProps {
  question: FeedQuestion
  isFullyInView: boolean
  topInset?: number
  listRef: TikTokListRef
}

export const RenderFeedQuestion = ({
  question,
  isFullyInView,
  topInset = 0,
  listRef,
}: RenderFeedQuestonProps) => {
  const [appearAnimFinished, setAppearAnimFinished] = useState(false)
  const [exitAnimationProgress, setExitAnimationProgress] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null)
  const [correctAnswerId, setCorrectAnswerId] = useState(null)
  const [userAnswerResult, setUserAnswerResult] = useState<{ isCorrect: boolean } | null>(null)
  const calledOnEnd = useRef(false)

  const {
    trigger: answerQuestion,
    error,
    loading,
  } = useApi(feedApi.answerFeedQuestion, {
    executeOnMount: false,
    props: [{ answerId: selectedAnswer?.id, questionUri: question.data.answerURI }],
    onSuccess: (answerResponse) => {
      if (isCorrectAnswerResponse(answerResponse)) {
        setUserAnswerResult({ isCorrect: true })
        setCorrectAnswerId(selectedAnswer.id)
      }

      if (isWrongAnswerResponse(answerResponse)) {
        setUserAnswerResult({ isCorrect: false })
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

  // Quiz enter animation useEffect
  useEffect(() => {
    let tId = null

    if (isFullyInView && !appearAnimFinished) {
      tId = setTimeout(() => setAppearAnimFinished(true), 1000)
    }

    return () => clearTimeout(tId)
  }, [isFullyInView])

  // Exit Animation Controller
  useEffect(() => {
    let timer: string | number | NodeJS.Timeout
    if (userAnswerResult && userAnswerResult?.isCorrect) {
      timer = setInterval(() => {
        if (exitAnimationProgress >= 0.8 && !calledOnEnd.current) {
          listRef.current.advanceItem()
          calledOnEnd.current = true
        }

        setExitAnimationProgress((prevProgress) => prevProgress + 0.01)
      }, 5)
    }

    return () => clearInterval(timer)
  }, [userAnswerResult, exitAnimationProgress, setExitAnimationProgress])

  return (
    <View marginTop={topInset} px="$10" alignItems="center" flex={1} gap="$8">
      {!appearAnimFinished ? (
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
                onPress={handleSelectedAnswer(answer)}
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
      {exitAnimationProgress ? (
        <View
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          justifyContent="center"
          alignItems="center"
        >
          <View flex={1} width="$full">
            <LottieView
              resizeMode="contain"
              source={GoodJobAnim}
              colorFilters={[{ keypath: "GOOD JOB! Outlines", color: "white" }]}
              style={{ flex: 1 }}
              autoPlay
              progress={exitAnimationProgress}
            />
          </View>
        </View>
      ) : null}
    </View>
  )
}
