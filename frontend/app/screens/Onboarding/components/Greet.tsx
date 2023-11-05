import { Button, ButtonText, Text, View } from "@gluestack-ui/themed"
import React from "react"
import { Step } from "../types"

interface Props {
  nickname: string
  setStep: (step: Step) => void
}

export const Greet = ({ nickname, setStep }: Props) => {
  const handleSubmit = () => {
    setStep(Step.CATEGORIES)
  }

  return (
    <View flex={1} justifyContent="space-between">
      <View />

      <View gap="$3">
        <Text size="xl">
          Welcome{" "}
          <Text size="2xl" fontWeight="$bold">
            {nickname}
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
