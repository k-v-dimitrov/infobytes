import React from "react"
import { Button, ButtonText, Text, View } from "@gluestack-ui/themed"
import { Step } from "../types"
import { actions, useOnboardingContext } from "../context"

export const Greet = () => {
  const { onboardingState, dispatch } = useOnboardingContext()
  const { displayName } = onboardingState

  const handleSubmit = () => {
    dispatch(actions.setStep(Step.CATEGORIES))
  }

  return (
    <View flex={1} justifyContent="space-between">
      <View />

      <View gap="$3">
        <Text size="xl">
          Welcome{" "}
          <Text size="2xl" fontWeight="$bold">
            {displayName}
          </Text>
          .
        </Text>
        <Text size="xl">
          Are you ready to learn new knowledge and challenge strangers or friends to a trivia game
          to level up and win exciting rewards?
        </Text>
      </View>

      <Button onPress={handleSubmit}>
        <ButtonText>Yes</ButtonText>
      </Button>
    </View>
  )
}
