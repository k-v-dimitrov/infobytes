import { useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "@utils/axios";
import { Fact } from "../types";

export const useGetUserFacts = () => {
  const [loading, setLoading] = useState(false);
  const [facts, setFacts] = useState<Fact[]>([]);

  const getUserFacts = async () => {
    setLoading(true);

    try {
      setLoading(true);

      const userId = await AsyncStorage.getItem("userId");

      const { data } = await axios.get(`feed?userId=${userId}`);

      setFacts(data);
    } catch (err) {
      const castedError = err as Error;

      Alert.alert("Failed to get facts!", castedError.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, facts, getUserFacts };
};
