import { Api } from "../api"
import { SubscribeUserToFeed } from "./feed.types"

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
}

export const feedApi = new FeedApi()
