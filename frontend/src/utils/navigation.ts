import {
  useNavigation as useNavigationNative,
  ParamListBase,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export const useNavigation = useNavigationNative<
  NativeStackNavigationProp<RootStackParamList>
>;

export enum Screens {
  FEED = "Feed",
  SEARCH = "Search",
}

export type RootStackParamList = {
  Feed: { category?: string };
  Search: undefined;
};

