import React from "react"
import { Heading, Pressable, Spinner, Text, VStack, View } from "@gluestack-ui/themed"
import { Screen } from "app/components"
import { useApi } from "app/hooks"
import { userApi } from "app/services/api/user"

import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { ProfileStackParamList } from "../ProfileNavigator"

export const ReviewCollection = ({
  navigation,
}: NativeStackScreenProps<ProfileStackParamList, "ReviewCollection">) => {
  const { data, loading } = useApi(userApi.getFactsForReview, {
    executeOnMount: true,
  })

  const navigateToFactVideo = (factId: string) => {
    navigation.navigate("FactVideo", { factId })
  }

  if (loading) {
    return (
      <Screen justifyContent="center" alignItems="center">
        <Spinner size="large" />
      </Screen>
    )
  }

  return (
    <Screen p={0}>
      <VStack space="lg">
        {data &&
          data.map((fact) => (
            <Pressable key={fact.id} onPress={() => navigateToFactVideo(fact.id)}>
              {({ pressed }) => (
                <View opacity={pressed ? "$30" : "$100"}>
                  <Heading textTransform="uppercase">#{fact.categoryType}</Heading>
                  <Heading size="md">{fact.title}</Heading>
                  <Text isTruncated={true}>{fact.text}</Text>
                </View>
              )}
            </Pressable>
          ))}
      </VStack>
    </Screen>
  )
}
