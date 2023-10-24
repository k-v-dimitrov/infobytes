import React, { useEffect } from "react";
import { Dimensions, FlatList, View } from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Screen } from "@layout/Screen";
import { Fact, useGetUserFeed } from "@features/feed";

export const Feed = () => {
  const bottomBarHeight = useBottomTabBarHeight();
  const height = Dimensions.get("screen").height;
  const { loading, facts, getUserFeed } = useGetUserFeed();

  useEffect(() => {
    getUserFeed();
  }, []);

  return (
    <Screen loading={loading}>
      <FlatList
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
        snapToInterval={height - bottomBarHeight - 50}
        data={facts}
        renderItem={({ item }) => (
          <View
            style={{
              height: height - bottomBarHeight - 50,
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
