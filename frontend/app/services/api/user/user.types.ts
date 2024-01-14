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

interface FactForReview {
  id: string
  createdAt: string
  categoryType: string
  sourceUrl: string
  text: string
  title: string
}

export interface GetFactsForReviewResponse {
  results: FactForReview[]

  message?: string
}
