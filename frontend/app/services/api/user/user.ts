import { Api } from "../api"
import { GetFactsForReviewResponse, SyncResponse } from "./user.types"

class UserApi extends Api {
  async sync() {
    const { data, ok } = await this.protectedApisauce.get<SyncResponse>("/user")

    return {
      data,
      error: ok ? null : data?.message,
    }
  }

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
}

export const userApi = new UserApi()
