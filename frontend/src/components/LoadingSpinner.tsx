import React from "react";
import { ActivityIndicator, ActivityIndicatorProps } from "react-native";

export const LoadingSpinner = (props: ActivityIndicatorProps) => {
  return <ActivityIndicator size='large' {...props} />;
};
