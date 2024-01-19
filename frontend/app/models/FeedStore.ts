import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const feedInitialState = {
  invitedToNextFeedItem: false,
}

export const FeedStoreModel = types
  .model("FeedStoreModel")
  .props({
    invitedToNextFeedItem: types.boolean,
  })
  .actions(withSetPropAction)
  .views(() => ({}))
  .actions(() => ({}))

export interface FeedStore extends Instance<typeof FeedStoreModel> {}
export interface FeedStoreSnapshot extends SnapshotOut<typeof FeedStoreModel> {}
