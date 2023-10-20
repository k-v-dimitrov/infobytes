import React, { ReactNode } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

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
    backgroundColor: "#3a5a40",
    alignItems: "center",
    justifyContent: "center",
  },
});
