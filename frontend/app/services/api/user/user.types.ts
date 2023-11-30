export interface SyncResponse {
  id: string
  email: string
  displayName: string
  isOnboarded: boolean
  categories: {
    category: string
  }[]

  message?: string
}
