import { useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "@utils/axios";
import { Fact } from "../types";

export const useGetUserFeed = () => {
  const [loading, setLoading] = useState(false);
  const [facts, setFacts] = useState<Fact[]>([]);

  const getUserFeed = async () => {
    setLoading(true);

    try {
      const existingUserId = await AsyncStorage.getItem("userId");

      if (existingUserId) {
        const { data } = await axios.get(`feed?userId=${existingUserId}`);

        setFacts(data);

        return;
      }

      const response = await axios.get("feed/user");

      const { userId } = response.data;

      await AsyncStorage.setItem("userId", userId);

      const { data } = await axios.get(`feed?userId=${userId}`);

      setFacts(data);
    } catch (err) {
      const castedErr = err as Error;

      console.error("[useGetUserFeed.ts] -", castedErr.message, castedErr);
    } finally {
      setLoading(false);
    }
  };

  return { loading, facts, getUserFeed };
};
