import { Category } from "app/screens/Onboarding/types"

export interface Credentials {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  displayName: string
  categories: Category[]
  isOnboarded: boolean
  message?: string
}

export interface ApiAuthResponseData {
  user: User
  token: string
  message?: string
}
