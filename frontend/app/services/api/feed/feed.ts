import { Api } from "../api"
import { FeedFact, SubscribeUserToFeed } from "./feed.types"

class FeedApi extends Api {
  async subscribeUserToFeed() {
    const authToken = await this.getAuthToken()

    const { data, ok, status } = await this.apisauce.get<SubscribeUserToFeed>(
      "feed/user",
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    )

    return {
      data,
      error: ok ? null : status,
    }
  }

  async getUserFeed(userFeedId: string) {
    const authToken = await this.getAuthToken()

    // TODO: handle feed questions
    const { data, ok, status } = await this.apisauce.get<FeedFact[]>(
      "/feed",
      { userFeedId, size: 2 },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    )

    return {
      data,
      error: ok ? null : status,
    }
  }
}

export const feedApi = new FeedApi()
