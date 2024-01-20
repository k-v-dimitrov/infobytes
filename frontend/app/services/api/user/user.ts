import { Api } from "../api"
import { SyncResponse } from "./user.types"

class UserApi extends Api {
  async sync() {
    const { data, ok } = await this.protectedApisauce.get<SyncResponse>("/user")

    return {
      data,
      error: ok ? null : data?.message,
    }
  }
}

export const userApi = new UserApi()
