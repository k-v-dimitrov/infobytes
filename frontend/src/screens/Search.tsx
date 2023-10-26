import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Icon, View, LoadingSpinner, Button } from "@components";
import { Screen } from "@layout/Screen";
import {
  CategoryButton,
  SearchInput,
  useGetCategories,
  useSearchFacts,
} from "@features/search";
import { FactsByCategory } from "features/search/components/FactsByCategory";

export const Search = () => {
  const { categories, categoriesLoading, getCategories } = useGetCategories();
  const { facts, factsLoading, searchFacts } = useSearchFacts();
  const [showSearchResult, setShowSearchResult] = useState(false);

  useEffect(() => {
    getCategories();
  }, []);

  const handleSearch = (search: string) => {
    searchFacts(search);

    setShowSearchResult(true);
  };

  const handleGoBack = () => {
    setShowSearchResult(false);
  };

  return (
    <Screen>
      <View flex={1} style={{ width: "100%" }}>
        <SearchInput handleSearch={handleSearch} />

        {(categoriesLoading || factsLoading) && <LoadingSpinner />}

        {!showSearchResult && !categoriesLoading && (
          <FlatList
            data={categories}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            renderItem={({ item }) => (
              <CategoryButton key={item} category={item} />
            )}
          />
        )}

        {showSearchResult && (
          <>
            <View style={{ width: "50%" }}>
              <Button
                icon={<Icon name="chevron-back-outline" />}
                onPress={handleGoBack}
                type="secondary"
                title="Return to Categories"
              />
            </View>

            <FactsByCategory facts={facts} />
          </>
        )}
      </View>
    </Screen>
  );
};
