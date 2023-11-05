import React, { useState } from "react"
import { Screen } from "app/components"
import { Button, ButtonText, Input, InputField, Text, VStack, View } from "@gluestack-ui/themed"
import messages from "app/utils/messages"
import { Step } from "../types"

interface Props {
  nickname: string
  setNickname: (nickname: string) => void
  setStep: (step: Step) => void
}

export const Nickname = ({ nickname, setNickname, setStep }: Props) => {
  const [error, setError] = useState("")

  const handleSubmit = () => {
    if (!nickname) {
      setError(messages.required)

      return
    }

    setStep(Step.GREET)
  }

  return (
    <View flex={1} justifyContent="space-between">
      <View />

      <VStack>
        <Text>Nickname</Text>
        <Input isInvalid={!!error} variant="outline" size="md">
          <InputField value={nickname} onChangeText={setNickname} placeholder="ThugPug_99" />
        </Input>
        {!!error && (
          <Text size="xs" color="$red500">
            {error}
          </Text>
        )}
      </VStack>

      <Button onPress={handleSubmit}>
        <ButtonText>Continue</ButtonText>
      </Button>
    </View>
  )
}
