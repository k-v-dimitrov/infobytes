export interface FactForReview {
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

export interface DeleteFactForReviewResponse {
  message?: string
}
