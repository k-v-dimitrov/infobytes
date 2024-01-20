/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useRef } from "react"
import {
  View,
  VStack,
  Heading,
  Modal,
  Text,
  ModalContent,
  ModalHeader,
  Center,
  ModalBody,
  ModalFooter,
  Button,
  ButtonText,
  HStack,
} from "@gluestack-ui/themed"
import LottieView from "lottie-react-native"
import { observer } from "mobx-react-lite"

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
import { useStores } from "app/models"

interface RenderFeedQuestonProps {
  question: FeedQuestion
  isFullyInView: boolean
  topInset?: number
  listRef: TikTokListRef
}

export const RenderFeedQuestion = observer(
  ({ question, isFullyInView, topInset = 0, listRef }: RenderFeedQuestonProps) => {
    const { feedStore } = useStores()
    const maybeAnsweredQuestion = feedStore.getAnsweredQuestion(question.data.id)

    const [appearAnimFinished, setAppearAnimFinished] = useState(maybeAnsweredQuestion && true)
    const [exitAnimationProgress, setExitAnimationProgress] = useState(
      maybeAnsweredQuestion ? 1 : 0,
    )
    const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(
      maybeAnsweredQuestion && maybeAnsweredQuestion.selectedAnswerId,
    )
    const [correctAnswerId, setCorrectAnswerId] = useState(
      maybeAnsweredQuestion && maybeAnsweredQuestion.correctAnswerId,
    )

    const [userAnswerResult, setUserAnswerResult] = useState<{ isCorrect: boolean } | null>(
      maybeAnsweredQuestion && { isCorrect: maybeAnsweredQuestion.isUserCorrect },
    )

    const [addFactModal, setAddFactModal] = useState(false)

    const calledOnEnd = useRef(maybeAnsweredQuestion && true)

    const {
      trigger: answerQuestion,
      error,
      loading,
    } = useApi(feedApi.answerFeedQuestion, {
      executeOnMount: false,
      props: [{ answerId: selectedAnswerId, questionUri: question.data.answerURI }],
      onSuccess: (answerResponse) => {
        if (isCorrectAnswerResponse(answerResponse)) {
          setUserAnswerResult({ isCorrect: true })
          setCorrectAnswerId(selectedAnswerId)
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
      if (!selectedAnswerId) {
        setSelectedAnswerId(answer.id)
      }
    }

    // Trigger api call
    useEffect(() => {
      if (selectedAnswerId && !userAnswerResult) {
        answerQuestion()
      }
    }, [selectedAnswerId])

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
        }, 1)
      }

      return () => clearInterval(timer)
    }, [userAnswerResult, exitAnimationProgress, setExitAnimationProgress])

    // On answer result
    useEffect(() => {
      // Show modal on not correct answer
      if (userAnswerResult && !userAnswerResult.isCorrect) {
        setAddFactModal(true)
      }

      // Save answered question to store
      if (userAnswerResult && correctAnswerId) {
        feedStore.addAnsweredQuestion({
          correctAnswerId,
          questionId: question.data.id,
          selectedAnswerId,
          isUserCorrect: userAnswerResult.isCorrect,
        })
      }
    }, [userAnswerResult, correctAnswerId])

    // TODO: remove this and fix perfomance issue introduced from observer
    if (!isFullyInView) {
      return null
    }

    return (
      <View marginTop={topInset} px="$10" alignItems="center" flex={1} gap="$8">
        <Modal isOpen={addFactModal && !maybeAnsweredQuestion?.closedAddForReviewModal} useRNModal>
          <ModalContent>
            <ModalHeader>
              <Center>
                <Text textAlign="center" size="md">
                  Oops, you got this wrong. Do you want to add Infobyte to review this fact?
                </Text>
              </Center>
            </ModalHeader>

            <ModalBody>
              <HStack justifyContent="space-around" pt="$4">
                <Button
                  onPress={() => {
                    console.warn("Not Implemented...")
                    feedStore.setClosedModalForReview(question.data.id)
                    setAddFactModal(false)
                  }}
                >
                  <ButtonText>Yes</ButtonText>
                </Button>
                <Button
                  onPress={() => {
                    feedStore.setClosedModalForReview(question.data.id)
                    setAddFactModal(false)
                  }}
                  bgColor="$trueGray700"
                >
                  <ButtonText>No</ButtonText>
                </Button>
              </HStack>
            </ModalBody>
            <ModalFooter />
          </ModalContent>
        </Modal>
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
                    selectedAnswerId === answer.id &&
                    answer.id !== correctAnswerId
                  }
                  isCorrect={correctAnswerId && answer.id === correctAnswerId}
                  isLoading={loading}
                />
              ))}
            </VStack>
          </>
        )}
        {exitAnimationProgress && exitAnimationProgress < 1 ? (
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
  },
)
