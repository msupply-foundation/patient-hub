import axios from "axios";
import { getUrl } from "../../../shared/utils";
interface PatientResponseData {
  ID: string;
  name: string;
  email: string;
  last: string;
  first: string;
  title: string;
  date_of_birth: Date;

  postal_address1: string;
}

const mapPatientData = (patientData: any) => {
  const { gender } = patientData;
  return {
    ...patientData,
    female: /female/i.test(gender),
  };
};

const createPatient = (patientData: any) =>
  axios
    .post<PatientResponseData>(getUrl("patient"), mapPatientData(patientData), {
      withCredentials: true,
    })
    .then(({ data }) => {
      return { data };
    });

const createNameNote = (nameId: string, patientEventId: string, data: any) =>
  axios
    .post<PatientResponseData>(
      getUrl("name_note"),
      {
        name_ID: nameId,
        patient_event_ID: patientEventId,
        data,
      },
      { withCredentials: true }
    )
    .then(({ data }) => {
      return { data };
    });

export const usePatientApi = () => {
  return { createPatient, createNameNote };
};
