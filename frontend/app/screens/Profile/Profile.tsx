import { Button, ButtonText, Divider, Text } from "@gluestack-ui/themed"
import { observer } from "mobx-react-lite"
import { Screen } from "app/components"
import { useStores } from "app/models"
import React from "react"
import { ScrollView } from "react-native-gesture-handler"

export const Profile = observer<any>(({ navigation }) => {
  const { authenticationStore } = useStores()

  const logout = async () => {
    await authenticationStore.logout()
    navigation.navigate("Auth")
  }

  return (
    <Screen p="$4">
      <ScrollView>
        <Text selectable>{authenticationStore.token}</Text>
        <Divider my="$2" />
        <Text>ID: {authenticationStore?.user?.id}</Text>
        <Divider my="$2" />
        <Text>EMAIL: {authenticationStore?.user?.email}</Text>
        <Divider my="$2" />
        <Text>DISPLAY_NAME: {authenticationStore?.user?.displayName}</Text>
        <Divider my="$2" />
        <Text>CATEGORIES: {authenticationStore?.user?.categories.join(", ")}</Text>
        <Divider my="$2" />
        <Text>IS_ONBOARDED: {authenticationStore?.user?.isOnboarded.toString()}</Text>
        <Divider my="$2" />
        <Text>level: {authenticationStore?.user?.level.toString()}</Text>
        <Divider my="$2" />
        <Text>levelPoints: {authenticationStore?.user?.levelPoints.toString()}</Text>
        <Divider my="$2" />
        <Button onPress={logout}>
          <ButtonText>Logout</ButtonText>
        </Button>
      </ScrollView>
    </Screen>
  )
})
