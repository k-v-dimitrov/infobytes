import { Instance, SnapshotOut, flow, types } from "mobx-state-tree"
import { userApi } from "app/services/api/user"
import { loadString, remove, saveString } from "app/utils/storage"

const AUTH_TOKEN_KEY = "USER_AUTH_TOKEN"

const UserModel = types.maybeNull(
  types.model("User").props({
    id: types.identifier,
    email: types.string,
    displayName: types.string,
    categories: types.array(types.string),
    isOnboarded: types.boolean,
    level: types.number,
    levelPoints: types.number,
  }),
)

export const authInitialState = {
  user: null,
  token: null,
}

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    user: UserModel,
    token: types.maybeNull(types.string),
  })
  .views((store) => ({
    get isAuthenticated() {
      return Boolean(store.token)
    },
    get isOnboarded() {
      return Boolean(store?.user?.isOnboarded)
    },
  }))
  .actions((store) => ({
    authenticate: flow(function* authenticate(token: string) {
      try {
        yield saveString(AUTH_TOKEN_KEY, token)
        store.token = token
      } catch {
        store.token = null
      }
    }),

    logout: flow(function* logout() {
      yield remove(AUTH_TOKEN_KEY)
      store.token = authInitialState.token
      store.user = authInitialState.user
    }),

    sync: flow(function* sync() {
      const authToken = yield loadString(AUTH_TOKEN_KEY)

      try {
        if (!authToken) {
          throw new Error()
        }

        const { data, error } = yield userApi.sync()

        if (error) {
          throw new Error()
        }

        const { id, email, displayName, categories, isOnboarded, level, levelPoints } = data

        const user = UserModel.create({
          id,
          email,
          displayName,
          isOnboarded,
          categories: categories.map(({ category }) => category),
          level,
          levelPoints,
        })

        store.user = user
      } catch {
        yield remove(AUTH_TOKEN_KEY)
        store.token = authInitialState.token
        store.user = authInitialState.user
      }
    }),
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}
