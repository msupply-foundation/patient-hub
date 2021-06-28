import { useLocation } from "react-router-dom";

export type AppConfig = {
  allowGuestAccess: {
    patients: boolean;
    adverseDrugReactions: boolean;
  };
  autologin: {
    patients: boolean;
    adverseDrugReactions: boolean;
  };
};

declare global {
  interface Window {
    patientHubConfig: AppConfig;
  }
}

interface LocationState {
  pathname: string;
}
const getRoute = (location: LocationState) => {
  const route = (location?.pathname ?? "").split("/")[1];

  switch (route) {
    case "patients":
      return "patients";
    case "adverse-drug-reactions":
      return "adverseDrugReactions";
    default:
      return undefined;
  }
};
export const useConfig = () => {
  const { patientHubConfig } = window;
  const location = useLocation();

  const route = getRoute(location);
  const allowGuestAccess = route
    ? patientHubConfig.allowGuestAccess[route]
    : true;

  return { ...patientHubConfig, allowGuestAccess };
};
