import { Api } from "../api"
import { FeedItem, SubscribeUserToFeed } from "./feed.types"

class FeedApi extends Api {
  async subscribeUserToFeed() {
    const { data, ok, status } = await this.protectedApisauce.get<SubscribeUserToFeed>("feed/user")

    return {
      data,
      error: ok ? null : status,
    }
  }

  async getUserFeed(userFeedId: string, size: number) {
    const { data, ok, status } = await this.protectedApisauce.get<FeedItem[]>("/feed", {
      userFeedId,
      size,
    })

    return {
      data,
      error: ok ? null : status,
    }
  }
}

export const feedApi = new FeedApi()
