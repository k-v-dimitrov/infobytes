import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "@expo/vector-icons/Ionicons";
import { useGetUserFeed } from "@features/feed";
import { Feed } from "@screens/Feed";
import { Search } from "@screens/Search";
import theme from "theme";

const Tab = createBottomTabNavigator();

export default function App() {
  const { getUserFeed } = useGetUserFeed();

  useEffect(() => {
    getUserFeed();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="feed"
        screenOptions={{
          headerShown: false,
          tabBarLabelStyle: {
            color: theme.primary,
            fontWeight: "bold",
          },
        }}
      >
        <Tab.Screen
          name="Feed"
          component={Feed}
          options={{
            tabBarIcon: ({ focused }) => (
              <Icon
                size={36}
                name={focused ? "book" : "book-outline"}
                color={theme.primary}
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
                size={36}
                name={focused ? "search" : "search-outline"}
                color={theme.primary}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
