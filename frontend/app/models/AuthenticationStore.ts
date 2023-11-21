import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    id: types.string,
    email: types.string,
  })
  .views((store) => ({
    get isAuthenticated() {
      return Boolean(store.id)
    },
  }))
  .actions((store) => ({
    authenticate({ id, email }) {
      store.id = id
      store.email = email
    },
    logout() {
      store.id = ""
      store.email = ""
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}
