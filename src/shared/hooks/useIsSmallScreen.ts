import { useMediaQuery } from "@material-ui/core";
import { Theme } from "../containers/ThemeProvider";

export const useIsSmallScreen = () => {
  const isSmallScreen = useMediaQuery<Theme>(({ breakpoints }) => {
    return breakpoints.down("sm");
  });

  return isSmallScreen;
};
