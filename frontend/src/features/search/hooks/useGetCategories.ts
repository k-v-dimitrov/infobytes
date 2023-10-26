import { useState } from "react";
import axios from "@utils/axios";

export const useGetCategories = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    setLoading(true);

    try {
      const { data } = await axios.get("/category/all");

      setCategories(data);
    } catch (error) {
      const castedErr = error as Error;

      console.error("[useGetUserFeed.ts] -", castedErr.message, castedErr);
    } finally {
      setLoading(false);
    }
  };

  return { loading, categories, getCategories };
};
