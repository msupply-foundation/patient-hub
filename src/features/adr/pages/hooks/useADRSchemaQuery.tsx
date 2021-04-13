import axios from "axios";
import { useQuery } from "react-query";
import { JSONSchema7 } from "json-schema";
import { useAuth } from "../../../auth/hooks/useAuth";

interface ADRResponseData {
  ui_schema: Record<string, string>;
  json_schema: JSONSchema7;
  ID: string;
}

export const getAdrSchema = () => {
  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:2048"
      : `${window.location.protocol}//${window.location.host}`;

  return axios
    .get<ADRResponseData[]>(`${url}/api/v4/patient_hub/form_schema?type=ADR`, {
      withCredentials: true,
    })
    .then(({ data }) => {
      const { ID: id, ui_schema: uiSchema, json_schema: jsonSchema } =
        data[0] ?? {};

      return { id, uiSchema, jsonSchema };
    });
};

export const useADRSchemaQuery = () => {
  const { username } = useAuth();
  const { isLoading, data } = useQuery("adrSchema", getAdrSchema, {
    enabled: !!username,
    refetchInterval: false,
    staleTime: Infinity,
  });

  return { isLoading, data };
};
