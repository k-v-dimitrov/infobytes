import React from "react"
import { HStack, Heading, VStack, View } from "@gluestack-ui/themed"
import { VideoPlayer } from "app/components"
import { MarkAsReviewedModal } from "./components/MarkAsReviewedModal"

import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { ProfileStackParamList } from "../ProfileNavigator"

export const FactVideo = ({
  route,
}: NativeStackScreenProps<ProfileStackParamList, "FactVideo">) => {
  const { id, title, category } = route.params

  return (
    <View flex={1}>
      <HStack
        position="absolute"
        zIndex={2}
        width="$full"
        px="$5"
        justifyContent="space-between"
        alignItems="center"
        bottom={10}
      >
        <VStack>
          <Heading size="xl" textTransform="uppercase">
            #{category}
          </Heading>
          <Heading isTruncated>{title}</Heading>
        </VStack>

        <MarkAsReviewedModal factId={id} />
      </HStack>

      <VideoPlayer factId={id} play />
    </View>
  )
}
