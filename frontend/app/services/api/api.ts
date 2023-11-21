/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://github.com/infinitered/ignite/blob/master/docs/Backend-API-Integration.md)
 * documentation for more details.
 */
import { ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import type { ApiAuthResponseData, ApiConfig, Credentials } from "./api.types"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

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
}

export const api = new Api()
