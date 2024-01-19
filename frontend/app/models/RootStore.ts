import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthenticationStoreModel, authInitialState } from "./AuthenticationStore"
import { FeedStoreModel, feedInitialState } from "./FeedStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  authenticationStore: types.optional(AuthenticationStoreModel, authInitialState),
  feedStore: types.optional(FeedStoreModel, feedInitialState),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
