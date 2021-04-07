import axios from "axios";
import { useQuery } from "react-query";
import { JSONSchema7 } from "json-schema";

interface ADRResponseData {
  ui_schema: Record<string, string>;
  json_schema: JSONSchema7;
}

export const getAdrSchema = () => {
  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:2048"
      : window.location.href;

  return axios
    .get<ADRResponseData[]>(`${url}/api/v4/patient_hub/form_schema?type=ADR`, {
      withCredentials: true,
    })
    .then(({ data }) => {
      const { ui_schema: uiSchema, json_schema: jsonSchema } = data[0] ?? {};

      return { uiSchema, jsonSchema };
    });
};

export const useADRSchemaQuery = () => {
  const { isLoading, data } = useQuery("adrSchema", getAdrSchema);

  return { isLoading, data };
};
