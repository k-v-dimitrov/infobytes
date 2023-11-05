import React, { Dispatch, SetStateAction, useState } from "react"
import { View, FlatList, Button, ButtonText, Heading, Pressable, Text, Spinner } from "@gluestack-ui/themed"
import { Category } from "../types"

interface Props {
  selectedCategories: Category[]
  setSelectedCategories: Dispatch<SetStateAction<Category[]>>
  handleFinish: () => void
}

export const Categories = ({ selectedCategories, setSelectedCategories, handleFinish }: Props) => {
  const [loading, setLoading] = useState(false)
  const data = Object.keys(Category)
  const hasRequiredCategories = selectedCategories.length >= 3

  const createOnPressHandler = (category: Category) => () => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories((prev) => prev.filter((current) => current !== category))
    } else {
      setSelectedCategories((prev) => [...prev, category])
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve("")
        }, 1000)
      })

      handleFinish()
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <View flex={1} justifyContent="center">
      <Heading size="xl" textAlign="center" mb="$5">
        Select topics of interest
      </Heading>

      <Text textAlign="center" size="lg" letterSpacing="$2xl">
        {!hasRequiredCategories && `${selectedCategories.length}/3`}
      </Text>

      <FlatList
        data={data}
        keyExtractor={(item: string) => item}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        renderItem={({ item }) => (
          <Pressable
            flex={1 / 2}
            borderWidth="$2"
            alignItems="center"
            py="$10"
            m="$1"
            borderRadius="$md"
            borderColor={selectedCategories.includes(item as Category) ? "$green500" : "$blue500"}
            onPress={createOnPressHandler(item as Category)}
          >
            <Heading size="sm" textTransform="uppercase">
              {item}
            </Heading>
          </Pressable>
        )}
      />

      <Button onPress={handleSubmit} isDisabled={!hasRequiredCategories || loading}>
        {loading ? <Spinner /> : <ButtonText>Begin your journey</ButtonText>}
      </Button>
    </View>
  )
}
