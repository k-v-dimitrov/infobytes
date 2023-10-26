import { StyleSheet } from "react-native";
import { IFactsByCategory } from "../types";
import { Text, View } from "components";

interface Props {
  facts: IFactsByCategory;
}

export const FactsByCategory = ({ facts }: Props) => {
  const hasFacts = Object.keys(facts).length > 0;

  return (
    <View>
      {!hasFacts && <Text>No results...</Text>}

      {hasFacts &&
        Object.entries(facts).map(([category, facts]) => (
          <View key={category}>
            <Text fontSize={56} fontWeight={"600"} style={styles.factCategory}>
              {category}
            </Text>

            {facts.map((fact) => (
              <Text key={fact.id} fontSize={32}>
                {fact.title}
              </Text>
            ))}
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  factCategory: {
    textTransform: "capitalize",
  },
});
