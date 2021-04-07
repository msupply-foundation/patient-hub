import { useQuery } from "react-query";
import axios from "axios";
import { JSONSchema7 } from "json-schema";
import { useAuth } from "../../auth/hooks/useAuth";

interface PatientSchemaResponseData {
  ui_schema: Record<string, string>;
  json_schema: JSONSchema7;
}

export const getPatientSurveySchema = () => {
  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:2048"
      : `${window.location.protocol}//${window.location.host}`;

  return axios
    .get<PatientSchemaResponseData[]>(
      `${url}/api/v4/patient_hub/form_schema?type=PatientSurvey`,
      { withCredentials: true }
    )
    .then(({ data }) => {
      const { ui_schema: uiSchema, json_schema: jsonSchema } = data[0] ?? {};

      return { uiSchema, jsonSchema };
    });
};

export const usePatientSurveySchemaQuery = () => {
  const { username } = useAuth();
  const { isLoading, data } = useQuery(
    "patientSurveySchema",
    getPatientSurveySchema,
    { enabled: !!username, refetchInterval: false, staleTime: Infinity }
  );

  return { isLoading, patientSurveySchema: data };
};
