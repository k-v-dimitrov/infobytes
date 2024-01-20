import React from "react"
import { VirtualizedList } from "react-native"
import { Heading, Pressable, Spinner, Text, View } from "@gluestack-ui/themed"
import { Screen } from "app/components"
import { useApi } from "app/hooks"
import { factApi } from "app/services/api/fact"

import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { FactForReview } from "app/services/api/fact"
import type { AppStackParamList } from "app/navigators"

export const ReviewCollection = ({
  navigation,
}: NativeStackScreenProps<AppStackParamList, "ReviewCollection">) => {
  const { data, loading } = useApi(factApi.getFactsForReview, {
    executeOnMount: true,
  })

  const navigateToFactVideo = (fact: FactForReview) => {
    navigation.navigate("FactVideo", {
      id: fact.id,
      category: fact.categoryType,
      title: fact.title,
    })
  }

  if (loading) {
    return (
      <Screen justifyContent="center" alignItems="center">
        <Spinner size="large" />
      </Screen>
    )
  }

  if (data && data.length === 0) {
    return (
      <Screen justifyContent="center" alignItems="center">
        <Text>No facts for review yet</Text>
      </Screen>
    )
  }

  return (
    <Screen p={0}>
      <VirtualizedList
        data={data || []}
        keyExtractor={(fact) => fact.id}
        getItemCount={(data) => data.length}
        getItem={(data, index) => data[index]}
        renderItem={({ item: fact }: { item: FactForReview }) => (
          <Pressable onPress={() => navigateToFactVideo(fact)} my="$1">
            {({ pressed }) => (
              <View opacity={pressed ? "$30" : "$100"}>
                <Heading textTransform="uppercase">#{fact.categoryType}</Heading>
                <Heading size="md">{fact.title}</Heading>
                <Text isTruncated={true}>{fact.text}</Text>
              </View>
            )}
          </Pressable>
        )}
      />
    </Screen>
  )
}
