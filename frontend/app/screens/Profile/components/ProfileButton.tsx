import React from "react"
import { Button, ButtonText } from "@gluestack-ui/themed"

interface ProfileButtonProps {
  text: string
  onClick: () => void
}

export const ProfileButton = ({ text, onClick }: ProfileButtonProps) => (
  <Button
    w={250}
    height="$12"
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
