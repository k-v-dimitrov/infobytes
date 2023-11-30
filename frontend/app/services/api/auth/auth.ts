import { Api } from "../api"
import { ApiAuthResponseData, Credentials, User } from "./auth.types"

class AuthApi extends Api {
  async login(credentials: Credentials) {
    const { data, ok } = await this.apisauce.post<ApiAuthResponseData>("/auth/login", credentials)

    return {
      data,
      error: ok ? null : "Invalid email or password!",
    }
  }

  async register(credentials: Credentials) {
    const { data, ok } = await this.apisauce.post<ApiAuthResponseData>(
      "/auth/register",
      credentials,
    )

    return {
      data,
      error: ok ? null : data.message,
    }
  }

  async completeOnboarding(onboardingData) {
    const authToken = await this.getAuthToken()

    const { data, ok } = await this.apisauce.patch<User>(
      "/user",
      { ...onboardingData, isOnboarded: true },
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

export const authApi = new AuthApi()
