import React from "react";
import { Dimensions, FlatList, Text, View } from "react-native";
import { Screen } from "@layout/Screen";
import { Fact } from "@features/facts";

import data from "../../data.json";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaFrame } from "react-native-safe-area-context";

export const Feed = () => {
  const bottomBarHeight = useBottomTabBarHeight();
  const { height } = useSafeAreaFrame();

  return (
    <Screen>
      <FlatList
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
        snapToInterval={height - bottomBarHeight - 50}
        data={data}
        renderItem={({ item }) => (
          <View
            style={{
              height: height - bottomBarHeight - 50,
            }}
          >
            <Fact
              title={item.title}
              summary={item.summary}
              source={item.source}
            />
          </View>
        )}
      />
    </Screen>
  );
};
