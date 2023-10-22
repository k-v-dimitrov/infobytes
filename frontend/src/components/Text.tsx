import { Text as ReactNativeText } from "react-native";
import type { TextProps } from "react-native";
import theme from "theme";

interface Props extends TextProps {
  fontSize?: number;
  color?: string;
  fontWeight?:
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
}

export const Text = (props: Props) => {
  const { style, fontSize, color, fontWeight, ...rest } = props;

  return (
    <ReactNativeText
      style={[{ color, fontSize, fontWeight }, style]}
      {...rest}
    />
  );
};

Text.defaultProps = {
  fontSize: 14,
  fontWeight: "400",
  color: theme.white,
};
