import React from "react"
import { Button, ButtonText } from "@gluestack-ui/themed"
import { Screen } from "app/components"
import { useStores } from "app/models"
import { remove } from "app/utils/storage"

export const Profile = ({ navigation }) => {
  const { authenticationStore } = useStores()

  const logout = async () => {
    await remove("userAuthToken")
    authenticationStore.logout()
    navigation.navigate("Auth")
  }

  return (
    <Screen>
      <Button onPress={logout}>
        <ButtonText>Logout</ButtonText>
      </Button>
    </Screen>
  )
}
