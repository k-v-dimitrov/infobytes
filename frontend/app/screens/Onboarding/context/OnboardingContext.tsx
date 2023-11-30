import React, { Dispatch, SetStateAction, createContext, useContext, useReducer } from "react"
import { OnboardingState, Step } from "../types"
import { onboardingReducer } from "./reducer"
import { Action } from "./actions"

const OnboardingContext = createContext<{
  onboardingState: OnboardingState
  dispatch: Dispatch<Action>
}>(undefined)

const initialState: OnboardingState = {
  categories: [],
  displayName: "",
  step: Step.NICKNAME,
}

export const OnboardingContextProvider = ({ children }) => {
  const [onboardingState, dispatch] = useReducer(onboardingReducer, initialState)

  const value = {
    onboardingState,
    dispatch,
  }

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
}

export const useOnboardingContext = () => {
  const onboardingContext = useContext(OnboardingContext)

  return onboardingContext
}
