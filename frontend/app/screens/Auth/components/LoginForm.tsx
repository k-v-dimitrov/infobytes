import {
  Heading,
  InputField,
  Text,
  VStack,
  View,
  Button,
  ButtonText,
  Input,
  LinkText,
} from "@gluestack-ui/themed"
import React, { useState } from "react"
import { LoginState, initialState, validateLogin } from "../utils/login"

interface Props {
  toggleIsLogin: () => void
  onSubmitSuccess: () => void
}

export const LoginForm = ({ toggleIsLogin, onSubmitSuccess }: Props) => {
  const [formState, setFormState] = useState<LoginState>(initialState)
  const [formErrors, setFormErrors] = useState<Partial<LoginState>>({})

  const handleOnChangeEmail = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      email: value,
    }))
  }

  const handleOnChangePassword = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      password: value,
    }))
  }

  const handleSubmit = async () => {
    const errors = validateLogin(formState)

    const hasErrors = Object.keys(errors).length > 0

    if (hasErrors) {
      setFormErrors(errors)

      return
    }

    onSubmitSuccess()
  }

  return (
    <View gap="$3.5">
      <Heading textAlign="center" size="2xl">
        Welcome back
      </Heading>

      <VStack>
        <Text>Email</Text>
        <Input isInvalid={!!formErrors.email} variant="outline" size="md">
          <InputField
            value={formState.email}
            onChangeText={handleOnChangeEmail}
            placeholder="john.doe@email.com"
          />
        </Input>
        {!!formErrors.email && (
          <Text size="xs" color="$red500">
            {formErrors.email}
          </Text>
        )}
      </VStack>

      <VStack>
        <Text>Password</Text>
        <Input isInvalid={!!formErrors.password} variant="outline" size="md">
          <InputField
            value={formState.password}
            onChangeText={handleOnChangePassword}
            type="password"
            placeholder="*********"
          />
        </Input>
        {!!formErrors.password && (
          <Text size="xs" color="$red500">
            {formErrors.password}
          </Text>
        )}
      </VStack>

      <Button onPress={handleSubmit} size="md" variant="solid" action="primary">
        <ButtonText textTransform="uppercase">Sign In</ButtonText>
      </Button>

      <Text textAlign="center" size="xs">
        Don't have an account?{" "}
        <LinkText onPress={toggleIsLogin} size="xs">
          Sign Up
        </LinkText>
      </Text>
    </View>
  )
}
