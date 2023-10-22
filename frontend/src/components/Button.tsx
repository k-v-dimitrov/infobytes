import React from "react";
import {
  Button as ReactNativeButton,
  ButtonProps,
  StyleSheet,
  View,
  Pressable,
  PressableProps,
} from "react-native";
import { Text } from "./Text";
import theme from "theme";

interface Props extends PressableProps {
  title: string;
}

export const Button = (props: Props) => {
  const { title, ...rest } = props;

  return (
    <View style={styles.button}>
      <Pressable {...rest}>
        <Text style={styles.text}>{title}</Text>
      </Pressable>
    </View>
  );
};

Button.defaultProps = {
  color: theme.white,
};

const styles = StyleSheet.create({
  button: {
    borderWidth: theme.borderWidth,
    borderColor: theme.white,
    borderRadius: theme.borderRadius,
  },
  text: {
    paddingVertical: 7,
    textAlign: "center",
    fontSize: 16
  },
});
