export type AppConfig = {
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

export const useConfig = () => {
  const { patientHubConfig } = window;
  return patientHubConfig;
};
