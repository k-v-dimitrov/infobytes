import React from "react";
import { Text } from "components/Text";
import { View } from "components/View";
import { Actions } from "./components/Actions";

interface Props {
  title: string;
  summary: string;
  source: string;
}

export const Fact = ({ title, summary, source }: Props) => {
  return (
    <View flex={1}>
      <View flex={3}>
        <Text fontSize={48} fontWeight="600">
          {title}
        </Text>
      </View>

      <View flex={10}>
        <Text fontSize={24}>{summary}</Text>
      </View>

      <Actions source={source} />
    </View>
  );
};
