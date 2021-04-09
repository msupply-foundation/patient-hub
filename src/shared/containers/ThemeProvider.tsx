import { FC, ReactNode } from "react";
import {
  createMuiTheme,
  Theme as MuiTheme,
  Palette as MuiPalette,
  PaletteColor,
} from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/styles";

declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
    menubar: Palette["primary"];
  }
  interface PaletteOptions {
    menubar: PaletteOptions["primary"];
  }
}

export interface Palette extends MuiPalette {
  menubar: PaletteColor;
}
export interface Theme extends MuiTheme {
  palette: Palette;
}

const theme = {
  palette: {
    primary: {
      main: "rgba(233,92,48,1)",
    },
    menubar: {
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
    caption: { color: "#9E9E9E" },
  },

  divider: "#333333",
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = (props) => (
  <MuiThemeProvider {...props} theme={createMuiTheme(theme)} />
);
