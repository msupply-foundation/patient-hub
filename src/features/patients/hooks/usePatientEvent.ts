import { useQuery } from "react-query";
import axios from "axios";
import { getUrl } from "../../../shared/utils";
import { useAuth } from "../../auth/hooks/useAuth";

interface PatientSchemaResponseData {
  ID: string;
  code: string;
  description: string;
  event_type: string;
  unit: string;
}

const getPatientEvent = (code: string) => () =>
  axios
    .get<PatientSchemaResponseData[]>(getUrl(`patient_event?code=${code}`), {
      withCredentials: true,
    })
    .then(({ data }) => {
      const { ID: id, description } = data[0] ?? {};

      return { id, description };
    });

export const usePatientEvent = (code: string = "PCD") => {
  const { username } = useAuth();
  const { isLoading, data: patientEvent } = useQuery(
    "patientEvent",
    getPatientEvent(code),
    {
      enabled: !!username,
      refetchInterval: false,
      staleTime: Infinity,
    }
  );

  return { isLoading, patientEvent };
};
