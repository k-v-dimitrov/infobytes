import React from "react";
import { View as ReactNativeView, ViewProps } from "react-native";

interface Props extends ViewProps {
  flex?: number;
}

export const View = (props: Props) => {
  const { flex, style, ...rest } = props;

  return (
    <ReactNativeView style={[{ flex }, style]} {...rest}>
      {props.children}
    </ReactNativeView>
  );
};
