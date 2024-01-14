import React from "react"
import { observer } from "mobx-react-lite"
import {
  Avatar,
  Heading,
  Icon,
  Progress,
  ProgressFilledTrack,
  Text,
  VStack,
  View,
} from "@gluestack-ui/themed"
import { Screen } from "app/components"
import { User } from "app/icons"
import { useStores } from "app/models"
import { getProgressPercentage } from "./utils/progressPercentage"
import { ProfileButton } from "./components/ProfileButton"

import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { ProfileStackParamList } from "./ProfileNavigator"

export const Profile = observer<NativeStackScreenProps<ProfileStackParamList, "Root">>(
  ({ navigation }) => {
    const { authenticationStore } = useStores()
    const { displayName, level, levelPoints, requiredPointsForNextLevel } = authenticationStore.user

    const progressPercentage = getProgressPercentage(levelPoints, requiredPointsForNextLevel)

    const navigateToMyReviewCollection = () => {
      navigation.navigate("ReviewCollection")
    }

    const logout = () => {
      authenticationStore.logout()
    }

    return (
      <Screen alignItems="center" gap="$16">
        <VStack space="md">
          <VStack alignItems="center">
            <Avatar height="$40" width="$40" bgColor="$blue500" borderRadius="$full">
              <Icon as={User} color="white" width="$24" height="$24" />
            </Avatar>
            <Heading size="xl">{displayName}</Heading>
          </VStack>

          <VStack>
            <View flexDirection="row" justifyContent="space-between">
              <Text>Level {level}</Text>
              <Text>
                {levelPoints}/{requiredPointsForNextLevel}
              </Text>
            </View>
            <Progress width={250} value={progressPercentage} size="md">
              <ProgressFilledTrack></ProgressFilledTrack>
            </Progress>
          </VStack>
        </VStack>

        <VStack space="xl">
          <ProfileButton text="My Review Collection" onClick={navigateToMyReviewCollection} />
          <ProfileButton text="Trivia History" />
          <ProfileButton text="My Rewards" />
          <ProfileButton text="Logout" onClick={logout} />
        </VStack>
      </Screen>
    )
  },
)
