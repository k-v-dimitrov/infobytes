import React from "react"
import { Button, ButtonIcon, ButtonText, Divider, Text, View } from "@gluestack-ui/themed"
import { FacebookLogo, GoogleLogo } from "app/icons"

export const Providers = () => {
  return (
    <View flexDirection="column">
      <View flexDirection="row" alignItems="center" mb="$3">
        <Divider h="$1" flex={1} />
        <Text size="xs" textAlign="center" flex={1}>
          or connect with
        </Text>
        <Divider h="$1" flex={1} />
      </View>

      <View flexDirection="row" gap="$6">
        <Button>
          <ButtonIcon size="xl" color="$white" mr="$2" as={FacebookLogo} />
          <ButtonText>Facebook</ButtonText>
        </Button>

        <Button flexGrow={1} bgColor="$white">
          <ButtonIcon size="xl" mr="$2" as={GoogleLogo} />
          <ButtonText color="$black">Google</ButtonText>
        </Button>
      </View>
    </View>
  )
}
