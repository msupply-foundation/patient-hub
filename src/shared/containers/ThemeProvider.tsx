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
    secondary: {
      main: "#ecf3fc",
    },
  },

  typography: {
    fontFamily: "Raleway",
    h3: {
      color: "#333333",
    },
    body2: {
      color: "#ecf3fc",
    },
    button: {},
  },

  divider: "#333333",
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = (props) => (
  <MuiThemeProvider {...props} theme={createMuiTheme(theme)} />
);
