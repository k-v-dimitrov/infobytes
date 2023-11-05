import { Instance, SnapshotOut, types } from "mobx-state-tree"

const UserModel = types.model("User").props({
  id: types.string,
  email: types.string,
  username: types.maybe(types.string),
})

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    user: types.maybeNull(types.reference(UserModel)),
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.user
    },
  }))
// .actions(() => ({}))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}
