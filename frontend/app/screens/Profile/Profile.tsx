import React, { useEffect, useState } from "react"
import { Button, ButtonText, Text } from "@gluestack-ui/themed"
import { Screen } from "app/components"
import { useStores } from "app/models"
import { loadString, remove } from "app/utils/storage"

export const Profile = ({ navigation }) => {
  const [authToken, setAuthToken] = useState("")
  const { authenticationStore } = useStores()

  const logout = async () => {
    await remove("userAuthToken")
    authenticationStore.logout()
    navigation.navigate("Auth")
  }

  useEffect(() => {
    const getAuthToken = async () => {
      const token = await loadString("userAuthToken")

      setAuthToken(token)
    }

    getAuthToken()
  }, [])

  return (
    <Screen>
      <Text selectable>{authToken}</Text>
      <Button onPress={logout}>
        <ButtonText>Logout</ButtonText>
      </Button>
    </Screen>
  )
}
