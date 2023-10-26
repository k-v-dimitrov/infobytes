import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "@expo/vector-icons/Ionicons";
import { Feed } from "@screens/Feed";
import { Search } from "@screens/Search";
import { Screens, RootStackParamList } from "@utils/navigation";
import theme from "theme";

const Tab = createBottomTabNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={Screens.FEED}
        screenOptions={{
          headerShown: false,
          tabBarLabelStyle: {
            color: theme.primary,
            fontWeight: "bold",
          },
        }}
      >
        <Tab.Screen
          name={Screens.FEED}
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
          name={Screens.SEARCH}
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
