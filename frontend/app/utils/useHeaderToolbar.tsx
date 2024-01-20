import React, { useLayoutEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { HeaderToolbar, HeaderToolbarProps } from "app/components/HeaderToolbar"
export function useHeaderToolbar(
  toolbarProps: HeaderToolbarProps = {},
  deps: Parameters<typeof useLayoutEffect>[1] = [],
) {
  const navigation = useNavigation()
  const [topInset, setTopInset] = useState(0)

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <HeaderToolbar onHeaderToolbarHeight={(h) => setTopInset(h)} {...toolbarProps} />
      ),
    })
  }, [...deps, navigation])

  return { topInset }
}
