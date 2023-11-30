import React, { useState } from "react"
import {
  Heading,
  Input,
  Text,
  VStack,
  View,
  InputField,
  Button,
  ButtonText,
  LinkText,
  Spinner,
  Alert,
  AlertIcon,
  InfoIcon,
  AlertText,
} from "@gluestack-ui/themed"
import { RegisterState, initialState, validateRegister } from "../utils/register"
import { useRegister } from "../hooks/useRegister"

interface Props {
  toggleIsLogin: () => void
}

export const RegisterForm = ({ toggleIsLogin }: Props) => {
  const { register, loading, error } = useRegister()

  const [formState, setFormState] = useState<RegisterState>(initialState)
  const [formErrors, setFormErrors] = useState<Partial<RegisterState>>({})

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

  const handleOnChangeRepeatPassword = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      repeatPassword: value,
    }))
  }

  const handleSubmit = async () => {
    const errors = validateRegister(formState)

    const hasErrors = Object.keys(errors).length > 0

    if (hasErrors) {
      setFormErrors(errors)

      return
    }

    register({ email: formState.email, password: formState.password })
  }

  return (
    <View gap="$3.5">
      <Heading textAlign="center" size="2xl">
        Create New Account
      </Heading>

      {error && (
        <Alert action="error" variant="accent">
          <AlertIcon as={InfoIcon} mr="$3" />
          <AlertText>{error}</AlertText>
        </Alert>
      )}

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

      <VStack>
        <Text>Repeat Password</Text>
        <Input isInvalid={!!formErrors.repeatPassword} variant="outline" size="md">
          <InputField
            value={formState.repeatPassword}
            onChangeText={handleOnChangeRepeatPassword}
            type="password"
            placeholder="*********"
          />
        </Input>
        {!!formErrors.repeatPassword && (
          <Text size="xs" color="$red500">
            {formErrors.repeatPassword}
          </Text>
        )}
      </VStack>

      <Button
        isDisabled={loading}
        onPress={handleSubmit}
        size="md"
        variant="solid"
        action="primary"
      >
        {loading ? <Spinner /> : <ButtonText textTransform="uppercase">Sign Up</ButtonText>}
      </Button>

      <Text textAlign="center" size="xs">
        Already have an account?{" "}
        <LinkText onPress={toggleIsLogin} size="xs">
          Sign In
        </LinkText>
      </Text>
    </View>
  )
}
