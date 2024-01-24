import React from "react"
import { VirtualizedList } from "react-native"
import { Spinner, Text } from "@gluestack-ui/themed"
import { Screen } from "app/components"
import { useApi } from "app/hooks"
import { factApi } from "app/services/api/fact"
import { SwipeableFact } from "./components/SwipeableFact"

import type { FactForReview } from "app/services/api/fact"

export const ReviewCollection = () => {
  const { data, loading } = useApi(factApi.getFactsForReview)

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
        renderItem={({ item: fact }: { item: FactForReview }) => <SwipeableFact fact={fact} />}
      />
    </Screen>
  )
}
