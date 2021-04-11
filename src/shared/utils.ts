import { createStyles, makeStyles } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles";
import { Theme } from "./containers/ThemeProvider";

export const getUrl = (path: string) =>
  process.env.NODE_ENV === "development"
    ? `http://localhost:2048/api/v4/patient_hub/${path}`
    : `${window.location.protocol}//${window.location.host}/api/v4/patient_hub/${path}`;

export const stylesFactory = (
  styles: StyleRules<{}, string> | ((t: Theme) => StyleRules<{}, string>)
) =>
  makeStyles((theme) => {
    if (typeof styles === "function") {
      return createStyles(styles(theme));
    } else {
      return createStyles(styles);
    }
  });
