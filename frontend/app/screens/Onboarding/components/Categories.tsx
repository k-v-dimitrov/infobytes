import React from "react"
import { Button, ButtonText, FlatList, Heading, Pressable, Text, View } from "@gluestack-ui/themed"
import { useCompleteOnboarding } from "../hooks/useCompleteOnboarding"
import { createAction, useOnboardingContext } from "../context"
import { Category } from "../types"

export const Categories = () => {
  const { onboardingState, dispatch } = useOnboardingContext()
  const { completeOnboarding, error: _error, loading } = useCompleteOnboarding()

  const { categories } = onboardingState
  const hasRequiredCategories = categories.length >= 3
  const data = Object.values(Category)

  const createOnPressHandler = (category: Category) => () => {
    const action = categories.includes(category)
      ? createAction("REMOVE_CATEGORY", category)
      : createAction("ADD_CATEGORY", category)

    dispatch(action)
  }

  const handleSubmit = async () => {
    const { step: _step, ...onboardingData } = onboardingState

    completeOnboarding(onboardingData)
  }

  return (
    <View flex={1} justifyContent="center">
      <Heading size="xl" textAlign="center" mb="$5">
        Select topics of interest
      </Heading>

      <Text textAlign="center" size="lg" letterSpacing="$2xl">
        {!hasRequiredCategories && `${categories.length}/3`}
      </Text>

      <FlatList
        data={data}
        keyExtractor={(item: string) => item}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        renderItem={({ item }) => (
          <Pressable
            flex={1 / 2}
            borderWidth="$2"
            alignItems="center"
            py="$10"
            m="$1"
            borderRadius="$md"
            borderColor={categories.includes(item as Category) ? "$green500" : "$blue500"}
            onPress={createOnPressHandler(item as Category)}
          >
            <Heading size="sm" textTransform="uppercase">
              {item}
            </Heading>
          </Pressable>
        )}
      />

      <Button onPress={handleSubmit} isDisabled={!hasRequiredCategories || loading}>
        <ButtonText>Begin your journey</ButtonText>
      </Button>
    </View>
  )
}
