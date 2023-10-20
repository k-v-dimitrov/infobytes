import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "@expo/vector-icons/Ionicons";
import { Feed } from "@screens/Feed";
import { Search } from "@screens/Search";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="feed"
        screenOptions={{
          headerShown: false,
          tabBarLabelStyle: {
            color: "#3a5a40",
            fontWeight: "bold",
          },
        }}
      >
        <Tab.Screen
          name="Feed"
          component={Feed}
          options={{
            tabBarIcon: ({ size, focused }) => (
              <Icon
                size={size}
                name={focused ? "book" : "book-outline"}
                color="#3a5a40"
              />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={Search}
          options={{
            tabBarIcon: ({ size, focused }) => (
              <Icon
                size={size}
                name={focused ? "search" : "search-outline"}
                color="#3a5a40"
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
