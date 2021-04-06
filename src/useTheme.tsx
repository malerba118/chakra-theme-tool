import React, { createContext, useState, useContext, FC } from "react";
import {
  theme as DEFAULT_THEME,
  extendTheme as chakraExtendTheme,
  ChakraProvider,
  ChakraTheme,
} from "@chakra-ui/react";

const ThemeContext = createContext<any>(null);

export const ThemeProvider: FC<any> = ({ children }) => {
  const [theme, setTheme] = useState<ChakraTheme>(DEFAULT_THEME);

  const extendTheme = (overrides: any) => {
    setTheme(chakraExtendTheme(overrides, theme));
  };

  return (
    <ChakraProvider theme={theme}>
      <ThemeContext.Provider value={[theme, extendTheme]}>
        {children}
      </ThemeContext.Provider>
    </ChakraProvider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
