import { useQuery } from "react-query";
import axios from "axios";
import { useAuth } from "../../auth/hooks/useAuth";

interface PatientEventResponseData {
  ID: string;
}

export const getPatientEvent = () => {
  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:2048"
      : window.location.href;

  return axios
    .get<PatientEventResponseData[]>(
      `${url}/api/v4/patient_hub/patient_event?code=PCD`,
      { withCredentials: true }
    )
    .then(({ data }) => {
      const { ID } = data[0] ?? {};
      return ID;
    });
};

export const usePatientEventQuery = () => {
  const { username } = useAuth();
  const { isLoading, data } = useQuery("patientEvent", getPatientEvent, {
    enabled: !!username,
    refetchInterval: false,
    staleTime: Infinity,
  });

  return { isLoading, patientEventID: data };
};
