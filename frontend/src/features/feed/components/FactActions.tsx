import React, { useState } from "react";
import { Linking, Pressable, StyleSheet } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { Button } from "components/Button";
import { View } from "components/View";

interface Props {
  source: string;
}

export const Actions = ({ source }: Props) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleOnPress = () => {
    Linking.openURL(source);
  };

  const toggleSaved = () => {
    setIsSaved((prev) => !prev);
  };

  return (
    <View flex={1} style={styles.actions}>
      <View flex={10}>
        <Button title="Continue Reading" onPress={handleOnPress} />
      </View>
      <View flex={2} style={styles.icon}>
        <Pressable onPress={toggleSaved}>
          <Icon name="heart" size={36} color={isSaved ? "red" : "white"} />
        </Pressable>
      </View>
      <View flex={2} style={styles.icon}>
        <Icon name="share" size={36} color="white" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: 8,
  },

  icon: {
    alignItems: "center",
  },
});
