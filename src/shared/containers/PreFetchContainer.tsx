import { FC } from "react";
import { useQueryClient } from "react-query";
import { getAdrSchema } from "../../features/adr/pages/hooks/useADRSchemaQuery";
import { getPatientSchema } from "../../features/patients/hooks/usePatientSurveySchemaQuery";

export const PreFetchContainer: FC = ({ children }) => {
  const queryClient = useQueryClient();

  queryClient.prefetchQuery("patientSchema", getPatientSchema);
  queryClient.prefetchQuery("adrSchema", getAdrSchema);

  return <>{children}</>;
};
