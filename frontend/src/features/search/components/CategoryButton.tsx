import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { Text } from "@components/Text";
import { useNavigation, Screens } from "@utils/navigation";
import theme from "theme";

interface Props {
  category: string;
}

export const CategoryButton = ({ category }: Props) => {
  const navigation = useNavigation();

  const handleOnPress = () => {
    navigation.navigate(Screens.FEED, { category });
  };

  return (
    <Pressable
      style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }, styles.category]}
      onPress={handleOnPress}
    >
      <Text fontSize={28} fontWeight="600" style={styles.categoryText}>
        {category}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  category: {
    flex: 1 / 2,
    borderWidth: theme.borderWidth,
    borderRadius: theme.borderRadius,
    borderColor: theme.white,
    paddingVertical: 40,
    margin: 4,
  },
  categoryText: {
    textTransform: "capitalize",
    textAlign: "center",
  },
});
