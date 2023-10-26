import React, { useEffect } from "react";
import { Dimensions, FlatList, View, Platform } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Screen } from "@layout/Screen";
import { Fact, useGetUserFeed } from "@features/feed";
import { RootStackParamList, Screens } from "@utils/navigation";

export const Feed = ({
  route,
}: NativeStackScreenProps<RootStackParamList, Screens.FEED>) => {
  const bottomBarHeight = useBottomTabBarHeight();
  const height = Dimensions.get("window").height;
  const { loading, facts, getUserFeed } = useGetUserFeed();
  const { category } = route.params || {};

  const HEIGHT = height - bottomBarHeight - (Platform.OS === "ios" ? 50 : 0);

  useEffect(() => {
    getUserFeed(category);
  }, [category]);

  return (
    <Screen loading={loading}>
      <FlatList
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
        snapToInterval={HEIGHT}
        data={facts}
        renderItem={({ item }) => (
          <View
            style={{
              height: HEIGHT,
            }}
          >
            <Fact
              title={item.title}
              summary={item.text}
              source={item.sourceUrl}
            />
          </View>
        )}
      />
    </Screen>
  );
};
