import { Category, Step } from "../types"

type GenericAction<TActionsMap> = {
  [Key in keyof TActionsMap]: {
    type: Key
    payload: TActionsMap[Key]
  }
}[keyof TActionsMap]

type OnboardingActionsMap = {
  SET_STEP: Step
  SET_DISPLAY_NAME: string
  ADD_CATEGORY: Category
  REMOVE_CATEGORY: Category
}

export type OnboardingAction = GenericAction<OnboardingActionsMap>

export function createAction<T extends keyof OnboardingActionsMap>(
  type: T,
  payload: OnboardingActionsMap[T],
) {
  return {
    type,
    payload,
  }
}
