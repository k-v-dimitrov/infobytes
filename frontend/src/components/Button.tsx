import React, { ReactNode } from "react";
import { StyleSheet, View, Pressable, PressableProps } from "react-native";
import { Text } from "./Text";
import theme from "theme";

interface Props extends PressableProps {
  title: string;
  type?: "primary" | "secondary";
  icon?: ReactNode;
}

export const Button = (props: Props) => {
  const { title, type = "primary", icon, ...rest } = props;

  return (
    <Pressable
      style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
      {...rest}
    >
      <View style={[styles[type], !!icon && styles.withIcon]}>
        {icon}

        <Text style={styles.text}>{title}</Text>
      </View>
    </Pressable>
  );
};

Button.defaultProps = {
  color: theme.white,
};

const styles = StyleSheet.create({
  withIcon: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  primary: {
    borderWidth: theme.borderWidth,
    borderColor: theme.white,
    borderRadius: theme.borderRadius,
  },
  secondary: {},
  text: {
    paddingVertical: 7,
    textAlign: "center",
    fontSize: 16,
  },
});
