import React from "react"
import { Button, ButtonText, Input, InputField, Text, VStack, View } from "@gluestack-ui/themed"
import { Step } from "../types"
import { actions, useOnboardingContext } from "../context"

export const Nickname = () => {
  const { onboardingState, dispatch } = useOnboardingContext()
  const { displayName } = onboardingState
  const isValid = Boolean(displayName)

  const handleSubmit = () => {
    dispatch(actions.setStep(Step.GREET))
  }

  const handleOnChange = (value: string) => {
    dispatch(actions.setDisplayName(value))
  }

  return (
    <View flex={1} justifyContent="space-between">
      <View />

      <VStack>
        <Text>Nickname</Text>
        <Input variant="outline" size="md">
          <InputField
            onSubmitEditing={handleSubmit}
            value={displayName}
            onChangeText={handleOnChange}
            placeholder="ThugPug_99"
          />
        </Input>
      </VStack>

      <Button isDisabled={!isValid} onPress={handleSubmit}>
        <ButtonText>Continue</ButtonText>
      </Button>
    </View>
  )
}
