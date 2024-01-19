import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const feedInitialState = {
  invitedToNextFeedItem: false,
  answeredQuestions: [],
}

const AnsweredQuestion = types
  .model("AnsweredQuestion")
  .props({
    questionId: types.string,
    correctAnswerId: types.string,
    selectedAnswerId: types.string,
    isUserCorrect: types.boolean,
    closedAddForReviewModal: types.boolean,
  })
  .actions(withSetPropAction)

export const FeedStoreModel = types
  .model("FeedStoreModel")
  .props({
    invitedToNextFeedItem: types.boolean,
    answeredQuestions: types.array(AnsweredQuestion),
  })
  .actions(withSetPropAction)
  .views((state) => ({
    getAnsweredQuestion(questionId: string) {
      const itemIndexToRetrieve = state.answeredQuestions.findIndex(
        ({ questionId: answeredQuestionId }) => questionId === answeredQuestionId,
      )
      if (itemIndexToRetrieve !== -1) {
        return state.answeredQuestions.at(itemIndexToRetrieve)
      }
    },
  }))
  .actions((state) => ({
    removeAnsweredQuestion: (questionId: string) => {
      const indexToRemove = state.answeredQuestions.findIndex(
        ({ questionId: answeredQuestionId }) => questionId === answeredQuestionId,
      )
      if (indexToRemove !== -1) {
        state.answeredQuestions.splice(indexToRemove, 1)
      }
    },
    addAnsweredQuestion(answeredQuestion: {
      questionId: string
      correctAnswerId: string
      selectedAnswerId: string
      isUserCorrect: boolean
    }) {
      state.answeredQuestions.push({ ...answeredQuestion, ...{ closedAddForReviewModal: false } })
    },
    setClosedModalForReview: (questionId: string) => {
      const itemIndexToUpdate = state.answeredQuestions.findIndex(
        ({ questionId: answeredQuestionId }) => questionId === answeredQuestionId,
      )

      state.answeredQuestions[itemIndexToUpdate].closedAddForReviewModal = true
    },
  }))

export interface FeedStore extends Instance<typeof FeedStoreModel> {}
export interface FeedStoreSnapshot extends SnapshotOut<typeof FeedStoreModel> {}
