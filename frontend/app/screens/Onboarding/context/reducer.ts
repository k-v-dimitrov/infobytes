import { OnboardingState } from "../types"
import { OnboardingAction } from "./actions"

export const onboardingReducer = (state: OnboardingState, action: OnboardingAction) => {
  switch (action.type) {
    case "SET_STEP": {
      return {
        ...state,
        step: action.payload,
      }
    }
    case "SET_DISPLAY_NAME": {
      return {
        ...state,
        displayName: action.payload,
      }
    }
    case "ADD_CATEGORY": {
      return {
        ...state,
        categories: [...state.categories, action.payload],
      }
    }
    case "REMOVE_CATEGORY": {
      return {
        ...state,
        categories: state.categories.filter((current) => current !== action.payload),
      }
    }
  }
}
