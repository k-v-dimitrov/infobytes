import { Api } from "../api"
import {
  CorrectAsnwerResponse,
  FeedItem,
  SubscribeUserToFeed,
  WrongAnswerResponse,
} from "./feed.types"

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

  async answerFeedQuestion({ questionUri, answerId }: { questionUri: string; answerId: string }) {
    const { data, ok } = await this.protectedApisauce.post<
      CorrectAsnwerResponse | WrongAnswerResponse
    >(questionUri, {
      answerId,
    })

    return {
      data,
      error: ok ? null : (data as unknown as { message: string }).message,
    }
  }
}

export const feedApi = new FeedApi()
