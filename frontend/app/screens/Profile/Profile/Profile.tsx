import React from "react"
import { observer } from "mobx-react-lite"
import { Avatar, Divider, Heading, Icon, Text, VStack } from "@gluestack-ui/themed"
import { Screen } from "app/components"
import { User } from "app/icons"
import { useStores } from "app/models"
import { LevelProgressBar } from "app/components/LevelProgressBar"
import { ProfileButton } from "./components/ProfileButton"

import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { AppStackParamList } from "app/navigators"

export const Profile = observer<NativeStackScreenProps<AppStackParamList, "Profile">>(
  ({ navigation }) => {
    const { authenticationStore } = useStores()
    const { displayName } = authenticationStore.user

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
            <Text size="sm">#email: {authenticationStore.user.email}</Text>
            <Divider />
          </VStack>

          <LevelProgressBar />
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
