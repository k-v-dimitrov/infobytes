import React, { useEffect } from "react";
import { Alert, FlatList, View } from "react-native";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Screen } from "@layout/Screen";
import { Fact, useGetUserFacts } from "@features/feed";

export const Feed = () => {
  const bottomBarHeight = useBottomTabBarHeight();
  const { height } = useSafeAreaFrame();
  const { loading, facts, getUserFacts } = useGetUserFacts();

  useEffect(() => {
    getUserFacts();
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
