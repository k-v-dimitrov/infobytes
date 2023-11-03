import React from "react";
import {SafeAreaView, StatusBar, useColorScheme} from "react-native";

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
    </SafeAreaView>
  );
}

export default App;
