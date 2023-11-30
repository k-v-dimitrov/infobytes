import { Category, Step } from "../types"

export enum ACTION_TYPES {
  SET_STEP = "SET_STEP",
  SET_DISPLAY_NAME = "SET_DISPLAY_NAME",
  ADD_CATEGORY = "ADD_CATEGORY",
  REMOVE_CATEGORY = "REMOVE_CATEGORY",
}

type SetStepAction = {
  type: ACTION_TYPES.SET_STEP
  payload: Step
}

type SetDisplayNameAction = {
  type: ACTION_TYPES.SET_DISPLAY_NAME
  payload: string
}

type AddCategoryAction = {
  type: ACTION_TYPES.ADD_CATEGORY
  payload: Category
}

type RemoveCategoryAction = {
  type: ACTION_TYPES.REMOVE_CATEGORY
  payload: Category
}

export type Action = SetStepAction | SetDisplayNameAction | AddCategoryAction | RemoveCategoryAction

const setStep = (step: Step): SetStepAction => ({
  type: ACTION_TYPES.SET_STEP,
  payload: step,
})

const setDisplayName = (displayName: string): SetDisplayNameAction => ({
  type: ACTION_TYPES.SET_DISPLAY_NAME,
  payload: displayName,
})

const addCategory = (category: Category): AddCategoryAction => ({
  type: ACTION_TYPES.ADD_CATEGORY,
  payload: category,
})

const removeCategory = (category: Category): RemoveCategoryAction => ({
  type: ACTION_TYPES.REMOVE_CATEGORY,
  payload: category,
})

export const actions = {
  setStep,
  setDisplayName,
  addCategory,
  removeCategory,
}
