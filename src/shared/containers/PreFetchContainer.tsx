import { FC } from "react";
import { useQueryClient } from "react-query";
import { getAdrSchema } from "../../features/adr/pages/hooks/useADRSchemaQuery";
import { getPatientSchema } from "../../features/patients/hooks/usePatientSchemaQuery";
import { getPatientSurveySchema } from "../../features/patients/hooks/usePatientSurveySchemaQuery";
import { useAuth } from "../hooks";

export const PreFetchContainer: FC = ({ children }) => {
  const queryClient = useQueryClient();
  const { username } = useAuth();

  if (username) {
    queryClient.prefetchQuery("patientSurveySchema", getPatientSurveySchema);
    queryClient.prefetchQuery("patientSchema", getPatientSchema);
    queryClient.prefetchQuery("adrSchema", getAdrSchema);
  }

  return <>{children}</>;
};
