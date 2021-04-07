import { useQuery } from 'react-query';
import axios from 'axios';
import { JSONSchema7 } from 'json-schema';

interface PatientSchemaResponseData {
  ui_schema: Record<string, string>;
  json_schema: JSONSchema7;
}

export const getPatientSchema = () =>
  axios
    .get<PatientSchemaResponseData[]>(
      `${window.location.protocol}//${window.location.host}/api/v4/patient_hub/form_schema?type=PatientSurvey`,
      // `http://localhost:2048/api/v4/patient_hub/form_schema?type=PatientSurvey`,
      { withCredentials: true }
    )
    .then(({ data }) => {
      const { ui_schema: uiSchema, json_schema: jsonSchema } = data[0] ?? {};

      return { uiSchema, jsonSchema };
    });

export const usePatientSchema = () => {
  const { isLoading, data } = useQuery('patientSchema', getPatientSchema);

  return { isLoading, data };
};
