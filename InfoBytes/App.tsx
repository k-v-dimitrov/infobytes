import React from "react";
import { StatusBar, useColorScheme } from "react-native";
import { config } from "@gluestack-ui/config";
import { GluestackUIProvider, Icon, Text, View } from "@gluestack-ui/themed";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Book, Search, PersonCircle } from "./src/icons";

const Tab = createBottomTabNavigator();

// temporary
const Screen = () => (
  <View>
    <Text>Screen</Text>
  </View>
);

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <GluestackUIProvider config={config}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Feed"
          screenOptions={{
            headerShown: false,
          }}>
          <Tab.Screen
            name="Feed"
            component={Screen}
            options={{
              tabBarIcon: ({ focused }) => (
                <Icon
                  size="xl"
                  color={focused ? "$blue500" : "$black"}
                  as={Book}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Search"
            component={Screen}
            options={{
              tabBarIcon: ({ focused }) => (
                <Icon
                  size="xl"
                  color={focused ? "$blue500" : "$black"}
                  as={Search}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={Screen}
            options={{
              tabBarIcon: ({ focused }) => (
                <Icon
                  size="xl"
                  color={focused ? "$blue500" : "$black"}
                  as={PersonCircle}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}

export default App;
