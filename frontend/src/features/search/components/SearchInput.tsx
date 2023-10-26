import React, { useState } from "react";
import { TextInput, StyleSheet } from "react-native";
import { View } from "@components/View";
import theme from "theme";

interface Props {
  handleSearch: (search: string) => void;
}

export const SearchInput = ({ handleSearch }: Props) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    if (!inputValue) return;

    handleSearch(inputValue);
  };

  return (
    <View>
      <TextInput
        style={styles.search}
        placeholder="Search..."
        cursorColor={theme.white}
        placeholderTextColor={theme.white}
        clearButtonMode="always"
        returnKeyType="search"
        value={inputValue}
        onChangeText={setInputValue}
        onSubmitEditing={handleSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  search: {
    marginTop: 16,
    marginBottom: 56,
    borderWidth: theme.borderWidth,
    borderRadius: theme.borderRadius,
    borderColor: theme.white,
    padding: 8,
    marginHorizontal: 4,
    color: theme.white,
  },
});
