import React, { useState } from "react"
import { Screen } from "app/components"
import { Nickname, Greet, Categories } from "./components"
import { Category, Step } from "./types"

export const Onboarding = ({ navigation }) => {
  const [step, setStep] = useState<Step>(Step.NICKNAME)
  const [nickname, setNickname] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])

  const handleFinish = () => {
    // navigation.navigate("Feed")

    console.log({ nickname, selectedCategories })
  }

  return (
    <Screen justifyContent="space-between">
      {step === Step.NICKNAME && (
        <Nickname nickname={nickname} setNickname={setNickname} setStep={setStep} />
      )}

      {step === Step.GREET && <Greet nickname={nickname} setStep={setStep} />}

      {step === Step.CATEGORIES && (
        <Categories
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          handleFinish={handleFinish}
        />
      )}
    </Screen>
  )
}
