import React from "react"
import { Button, ButtonText, Spinner } from "@gluestack-ui/themed"

interface QuizButtonProps {
  text: string
  onClick?: () => void
  isCorrect?: boolean
  isWrong?: boolean
  isLoading?: boolean
}

export const QuizButton = ({ text, isCorrect, isWrong, isLoading, onClick }: QuizButtonProps) => {
  const borderColor = isCorrect ? "$green500" : isWrong ? "$red500" : "$blue900"

  return (
    <Button
      w={250}
      height="$24"
      size="lg"
      variant="outline"
      action="primary"
      isDisabled={false}
      isFocusVisible={false}
      onPressOut={onClick}
      borderColor={borderColor}
      borderWidth={3}
    >
      {isLoading ? <Spinner /> : <ButtonText>{text}</ButtonText>}
    </Button>
  )
}
