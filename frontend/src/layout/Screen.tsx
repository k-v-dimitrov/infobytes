import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import theme from "theme";
import { LoadingSpinner } from "components/LoadingSpinner";

interface Props {
  children: ReactNode;
  loading?: boolean;
}

export const Screen = ({ children, loading }: Props) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />

        {loading ? <LoadingSpinner /> : children}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
});
