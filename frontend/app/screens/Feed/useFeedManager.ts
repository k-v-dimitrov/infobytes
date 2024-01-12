import { useStores } from "app/models"
import { feedApi } from "app/services/api/feed"
import { autorun } from "mobx"
import { useEffect, useState } from "react"

const useFeedManager = () => {
  const { authenticationStore } = useStores()
  const [feedList, setFeedList] = useState([])

  useEffect(() => {
    autorun(() => {
      const handleFirstFeedEncounter = async () => {
        const { data, error } = await feedApi.subscribeUserToFeed()
        if (error) {
          // TODO: show user error!
          console.warn("Failed getting feed user id!")
          console.warn(data)
        } else {
          authenticationStore.setFeedUserId(data.feedUserId)
        }
      }

      if (!authenticationStore.feedUserId) {
        handleFirstFeedEncounter()
      }
    })
  }, [])

  useEffect(() => {
    autorun(() => {
      if (authenticationStore.feedUserId) {
      }
    })
  }, [])
}

export default useFeedManager
