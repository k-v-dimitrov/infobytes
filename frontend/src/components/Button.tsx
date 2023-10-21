import React from "react";
import {
  Button as ReactNativeButton,
  ButtonProps,
  StyleSheet,
  View,
} from "react-native";
import theme from "theme";

interface Props extends ButtonProps {}

export const Button = (props: Props) => {
  return (
    <View style={styles.button}>
      <ReactNativeButton {...props} />
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
});
