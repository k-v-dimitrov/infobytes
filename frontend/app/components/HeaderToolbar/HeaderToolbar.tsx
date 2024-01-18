import React, { useState, useEffect } from "react"
import { HStack, Avatar, Pressable, Icon } from "@gluestack-ui/themed"

import { navigate } from "app/navigators"
import { User } from "app/icons"

import { LevelProgressBar } from "../LevelProgressBar"

export interface HeaderToolbarProps {
  onHeaderToolbarHeight?: (height: number) => void
}

export const HeaderToolbar = ({ onHeaderToolbarHeight }: HeaderToolbarProps) => {
  const [headerToolBarHeight, setHeaderToolBarHeight] = useState(0)

  const navigateToProfile = () => {
    navigate({ name: "Profile", params: undefined })
  }

  useEffect(() => {
    onHeaderToolbarHeight && onHeaderToolbarHeight(headerToolBarHeight)
  }, [headerToolBarHeight])

  return (
    <HStack
      onLayout={({
        nativeEvent: {
          layout: { height },
        },
      }) => setHeaderToolBarHeight(height)}
      zIndex={2}
      position="absolute"
      top={0}
      left={0}
      right={0}
      alignItems="center"
      justifyContent="center"
      space="lg"
      p="$5"
    >
      <LevelProgressBar />

      <Pressable onPress={navigateToProfile}>
        <Avatar bgColor="$blue500" borderRadius="$full" size="md">
          <Icon as={User} color="white" size="xl" />
        </Avatar>
      </Pressable>
    </HStack>
  )
}
