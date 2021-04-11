import { FC } from "react";
import { useQueryClient } from "react-query";
import { getAdrSchema } from "../../features/adr/pages/hooks/useADRSchemaQuery";
import { useHaveFontsLoaded } from "../hooks/useFontLoading";
import { getPatientSchema } from "../../features/patients/hooks/usePatientSchemaQuery";
import { getPatientSurveySchema } from "../../features/patients/hooks/usePatientSurveySchemaQuery";
import { useAuth } from "../../features/auth/hooks";

export const PreFetchContainer: FC = ({ children }) => {
  const queryClient = useQueryClient();
  const { username } = useAuth();
  const fontsHaveLoaded = useHaveFontsLoaded();

  if (username) {
    queryClient.prefetchQuery("patientSurveySchema", getPatientSurveySchema);
    queryClient.prefetchQuery("patientSchema", getPatientSchema);
    queryClient.prefetchQuery("adrSchema", getAdrSchema);
  }

  return <>{fontsHaveLoaded ? children : null}</>;
};
