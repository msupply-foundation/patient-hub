import axios from 'axios';

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

const createPatient = ({ patientContactData }: { patientContactData?: any }) =>
  axios
    .post<PatientResponseData>(
      `${window.location.protocol}//${window.location.host}/api/v4/patient_hub/patient`,
      // `http://localhost:2048/api/v4/patient_hub/patient`,
      patientContactData
    )
    .then(({ data }) => {
      return { data };
    });

const createNameNote = (nameId: string, data: any) =>
  axios
    .post<PatientResponseData>(
      `${window.location.protocol}//${window.location.host}/api/v4/patient_hub/name_note`,
      // `http://localhost:2048/api/v4/patient_hub/name_note`,
      { name_ID: nameId, patient_event_ID: 'B3DD72A976B74A2FA28D649E6BF247BA', data }
    )
    .then(({ data }) => {
      return { data };
    });

export const usePatientApi = () => {
  return { createPatient, createNameNote };
};
