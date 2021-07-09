import { createStyles, makeStyles } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles";
import { Theme } from "./containers/ThemeProvider";

const getBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? "http://localhost:2048/api/v4"
    : `${window.location.protocol}//${window.location.host}/api/v4`;

export const getUrl = (path: string) => `${getBaseUrl()}/patient_hub/${path}`;

export const getPatientUrl = () => `${getBaseUrl()}/patient`;
export const getPatientHistoryUrl = (id: string) =>
  `${getBaseUrl()}/patient_history?id=${id}`;

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
