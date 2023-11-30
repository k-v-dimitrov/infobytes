export enum Step {
  NICKNAME = "NICKNAME",
  GREET = "GREET",
  CATEGORIES = "CATEGORIES",
}

export enum Category {
  History = "history",
  Cinema = "cinema",
  Technology = "technology",
  Art = "art",
  Sport = "sport",
  Fashion = "fashion",
  Science = "science",
  Geography = "geography",
}

export interface OnboardingState {
  step: Step
  displayName: string
  categories: Category[]
}
