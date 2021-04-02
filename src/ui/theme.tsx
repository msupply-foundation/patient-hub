import { FC, ReactNode } from "react";
import {
  createMuiTheme,
  ThemeProvider as MuiThemeProvider,
} from "@material-ui/core/styles";

const theme = {
  palette: {
    primary: {
      main: "rgba(233,92,48,1)",
    },
  },

  typography: {
    h3: {
      color: "#333333",
    },
  },

  divider: "#333333",
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = (props) => (
  <MuiThemeProvider {...props} theme={createMuiTheme(theme)} />
);
