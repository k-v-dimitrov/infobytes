import React from "react"
import { Button, ButtonText, Input, InputField, Text, VStack, View } from "@gluestack-ui/themed"
import { Step } from "../types"

interface Props {
  nickname: string
  setNickname: (nickname: string) => void
  setStep: (step: Step) => void
}

export const Nickname = ({ nickname, setNickname, setStep }: Props) => {
  const isValid = Boolean(nickname)

  const handleSubmit = () => {
    setStep(Step.GREET)
  }

  return (
    <View flex={1} justifyContent="space-between">
      <View />

      <VStack>
        <Text>Nickname</Text>
        <Input variant="outline" size="md">
          <InputField
            onSubmitEditing={handleSubmit}
            value={nickname}
            onChangeText={setNickname}
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
