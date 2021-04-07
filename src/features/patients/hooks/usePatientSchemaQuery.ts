import { useQuery } from "react-query";
import axios from "axios";
import { JSONSchema7 } from "json-schema";

interface PatientSchemaResponseData {
  ui_schema: Record<string, string>;
  json_schema: JSONSchema7;
}

export const getPatientSchema = () => {
  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:2048"
      : window.location.href;

  return axios
    .get<PatientSchemaResponseData[]>(
      `${url}/api/v4/patient_hub/form_schema?type=Patient`,
      { withCredentials: true }
    )
    .then(({ data }) => {
      const { ui_schema: uiSchema, json_schema: jsonSchema } = data[0] ?? {};

      return { uiSchema, jsonSchema };
    });
};

export const usePatientSchemaQuery = () => {
  const { isLoading, data } = useQuery("patientSchema", getPatientSchema);

  return { isLoading, patientSchema: data };
};
