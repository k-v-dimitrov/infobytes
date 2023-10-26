import { useState } from "react";
import axios from "@utils/axios";

export const useGetCategories = () => {
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    setCategoriesLoading(true);

    try {
      const { data } = await axios.get("/category/all");

      setCategories(data);
    } catch (error) {
      const castedErr = error as Error;

      console.error("[useGetCategories.ts] -", castedErr.message, castedErr);
    } finally {
      setCategoriesLoading(false);
    }
  };

  return { categoriesLoading, categories, getCategories };
};
