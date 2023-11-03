import React from "react";
import { StatusBar, useColorScheme } from "react-native";
import { config } from "@gluestack-ui/config";
import { GluestackUIProvider, Icon } from "@gluestack-ui/themed";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BookIcon, PersonCircleIcon, SearchIcon } from "@icons";
import { Feed, Search, Profile } from "@screens";

const Tab = createBottomTabNavigator();

// temporary

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
            component={Feed}
            options={{
              tabBarIcon: ({ focused }) => (
                <Icon
                  size="xl"
                  color={focused ? "$blue500" : "$black"}
                  as={BookIcon}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Search"
            component={Search}
            options={{
              tabBarIcon: ({ focused }) => (
                <Icon
                  size="xl"
                  color={focused ? "$blue500" : "$black"}
                  as={SearchIcon}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              tabBarIcon: ({ focused }) => (
                <Icon
                  size="xl"
                  color={focused ? "$blue500" : "$black"}
                  as={PersonCircleIcon}
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
