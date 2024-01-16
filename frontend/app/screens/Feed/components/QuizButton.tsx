import React from "react"
import { Button, ButtonText } from "@gluestack-ui/themed"

interface QuizButtonProps {
  text: string
  onClick?: () => void
}

export const QuizButton = ({ text, onClick }: QuizButtonProps) => (
  <Button
    w={250}
    height="$24"
    size="lg"
    variant="outline"
    action="primary"
    isDisabled={false}
    isFocusVisible={false}
    onPress={onClick}
  >
    <ButtonText>{text}</ButtonText>
  </Button>
)
