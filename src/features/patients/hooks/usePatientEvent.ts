import { useQuery } from 'react-query';
import axios from 'axios';

interface PatientSchemaResponseData {
  ID: string;
  code: string;
  description: string;
  event_type: string;
  unit: string;
}

const getPatientEvent = (code: string) => () =>
  axios
    .get<PatientSchemaResponseData[]>(
      `${window.location.protocol}//${window.location.host}/api/v4/patient_hub/patient_event?code=${code}`
      //   `http://localhost:2048/api/v4/patient_hub/patient_event?code=${code}`
    )
    .then(({ data }) => {
      const { ID: id, description } = data[0] ?? {};

      return { id, description };
    });

export const usePatientEvent = (code: string = 'PCD') => {
  const { isLoading, data: patientEvent } = useQuery('patientSchema', getPatientEvent(code));

  return { isLoading, patientEvent };
};
