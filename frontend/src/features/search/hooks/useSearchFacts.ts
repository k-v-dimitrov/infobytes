import { useState } from "react";
import { Fact } from "@features/feed/types";
import axios from "@utils/axios";
import { IFactsByCategory } from "../types";

export const useSearchFacts = () => {
  const [factsLoading, setFactsLoading] = useState(false);
  const [facts, setFacts] = useState<IFactsByCategory>({});

  const searchFacts = async (search: string) => {
    setFactsLoading(true);

    try {
      const { data } = await axios.get<{ results: Fact[] }>("/fact", {
        params: {
          search,
        },
      });

      const factsByCategory = data.results.reduce<IFactsByCategory>(
        (acc, curr) => {
          acc[curr.categoryType] = [...(acc[curr.categoryType] || []), curr];

          return acc;
        },
        {}
      );

      setFacts(factsByCategory);
    } catch (error) {
      const castedError = error as Error;

      console.error("[useSearchFacts.ts] -", castedError.message, castedError);
    } finally {
      setFactsLoading(false);
    }
  };

  return { factsLoading, searchFacts, facts };
};
