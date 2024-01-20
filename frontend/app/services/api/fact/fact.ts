import { Api } from "../api"
import { DeleteFactForReviewResponse, GetFactsForReviewResponse } from "./fact.types"

class FactApi extends Api {
  async getFactsForReview() {
    const { data, ok } = await this.protectedApisauce.get<GetFactsForReviewResponse>(
      "/fact/review",
      {
        sortBy: ["createdAt"],
        page: 1,
        size: 10,
      },
    )

    return {
      data: data.results,
      error: ok ? null : data.message,
    }
  }

  async deleteFactForReview(factId: string) {
    const { data, ok } = await this.protectedApisauce.delete<DeleteFactForReviewResponse>(
      "/fact/review",
      { factId },
    )

    return {
      data,
      error: ok ? null : data.message,
    }
  }
}

export const factApi = new FactApi()
