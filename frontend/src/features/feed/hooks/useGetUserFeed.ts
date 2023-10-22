import { useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "@utils/axios";

export const useGetUserFeed = () => {
  const [loading, setLoading] = useState(false);

  const getUserFeed = async () => {
    setLoading(true);

    try {
      const existingUserId = await AsyncStorage.getItem("userId");
      if (existingUserId) return;

      const { data } = await axios.get("feed/user");

      await AsyncStorage.setItem("userId", data.userId);
    } catch (err) {
      const castedErr = err as Error;

      Alert.alert("Failed to get user feed!", castedErr.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, getUserFeed };
};
