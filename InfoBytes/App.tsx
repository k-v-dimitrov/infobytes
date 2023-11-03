import React from "react";
import { SafeAreaView, StatusBar, useColorScheme } from "react-native";
import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <GluestackUIProvider config={config}>
      <SafeAreaView>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      </SafeAreaView>
    </GluestackUIProvider>
  );
}

export default App;
