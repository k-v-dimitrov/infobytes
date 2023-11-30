import { Category, OnboardingState } from "../types"
import { ACTION_TYPES, Action } from "./actions"

export const onboardingReducer = (state: OnboardingState, action: Action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_STEP: {
      return {
        ...state,
        step: action.payload,
      }
    }
    case ACTION_TYPES.SET_DISPLAY_NAME: {
      return {
        ...state,
        displayName: action.payload,
      }
    }
    case ACTION_TYPES.ADD_CATEGORY: {
      return {
        ...state,
        categories: [...state.categories, action.payload],
      }
    }
    case ACTION_TYPES.REMOVE_CATEGORY: {
      return {
        ...state,
        categories: state.categories.filter((current) => current !== action.payload),
      }
    }

    default: {
      throw "Unknown action type"
    }
  }
}
