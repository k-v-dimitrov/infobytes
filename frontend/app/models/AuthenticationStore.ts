import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    id: types.string,
    email: types.string,
    displayName: types.string,
    categories: types.array(types.string),
    isOnboarded: types.boolean,
  })
  .views((store) => ({
    get isAuthenticated() {
      return Boolean(store.id)
    },
  }))
  .actions((store) => ({
    authenticate({ id, email, displayName, categories, isOnboarded }) {
      store.id = id
      store.email = email
      store.displayName = displayName
      store.categories = categories
      store.isOnboarded = isOnboarded
    },

    logout() {
      store.id = ""
      store.email = ""
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}
