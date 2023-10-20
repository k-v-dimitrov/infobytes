import { StatusBar } from "expo-status-bar";
import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import theme from "theme";

interface Props {
  children: ReactNode;
}

export const Screen = ({ children }: Props) => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
