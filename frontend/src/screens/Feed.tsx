import React, { useEffect } from "react";
import { Dimensions, FlatList, View, Platform } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Screen } from "@layout/Screen";
import { Fact, useGetUserFeed } from "@features/feed";
import { RootStackParamList, Screens, useNavigation } from "@utils/navigation";
import { Button, Icon, Text } from "components";

export const Feed = ({
  route,
}: NativeStackScreenProps<RootStackParamList, Screens.FEED>) => {
  const bottomBarHeight = useBottomTabBarHeight();
  const height = Dimensions.get("window").height;
  const { loading, facts, getUserFeed } = useGetUserFeed();
  const navigation = useNavigation();
  const { category } = route.params || {};

  // temporary solution
  const HEIGHT =
    height -
    bottomBarHeight -
    (Platform.OS === "ios" ? 50 : 0) -
    (!!category ? 30 : 0);

  useEffect(() => {
    getUserFeed(category);
  }, [category]);

  const clearFilter = () => {
    navigation.navigate(Screens.FEED);
  };

  return (
    <Screen loading={loading}>
      {category && (
        <Button
          style={{ alignSelf: "flex-start", width: "25%" }}
          icon={<Icon name="close-outline" size={24} />}
          onPress={clearFilter}
          title={category}
        />
      )}

      {facts.length === 0 && <Text>No facts found...</Text>}

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
