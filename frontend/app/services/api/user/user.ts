import { Api } from "../api"
import { SyncResponse } from "./user.types"

class UserApi extends Api {
  async sync() {
    const authToken = await this.getAuthToken()

    const { data, ok } = await this.apisauce.get<SyncResponse>(
      "/user",
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    )

    return {
      data,
      error: ok ? null : data.message,
    }
  }
}

export const userApi = new UserApi()
