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
  AlertText,
  Alert,
  AlertIcon,
  InfoIcon,
} from "@gluestack-ui/themed"
import React, { useState } from "react"
import { LoginState, initialState, validateLogin } from "../utils/login"
import { useApi } from "app/hooks"
import { authApi } from "app/services/api"
import { useStores } from "app/models"
import { navigate } from "app/navigators"

interface Props {
  toggleIsLogin: () => void
}

export const LoginForm = ({ toggleIsLogin }: Props) => {
  const { authenticationStore } = useStores()
  const [formState, setFormState] = useState<LoginState>(initialState)
  const [formErrors, setFormErrors] = useState<Partial<LoginState>>({})
  const { loading, error, trigger } = useApi(authApi.login, {
    executeOnMount: false,
    props: [formState],
    onSuccess: async (data) => {
      await authenticationStore.authenticate(data.token)
      navigate({ name: "Feed", params: undefined })
    },
  })

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

    trigger()
  }

  return (
    <View gap="$3.5">
      <Heading textAlign="center" size="2xl">
        Welcome back
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

      <Button
        isDisabled={loading}
        onPress={handleSubmit}
        size="md"
        variant="solid"
        action="primary"
      >
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
