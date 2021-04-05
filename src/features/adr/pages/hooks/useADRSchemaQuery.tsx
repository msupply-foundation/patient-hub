import axios from "axios";
import { useQuery } from "react-query";
import { JSONSchema7 } from "json-schema";

interface ADRResponseData {
  ui_schema: Record<string, string>;
  json_schema: JSONSchema7;
}

export const getAdrSchema = () =>
  axios
    .get<ADRResponseData>(
      "https://7jj66vzhdk.execute-api.ap-southeast-2.amazonaws.com/default/form_schema?type=ADR"
      // "http://localhost:2048/api/v4/form_schema?type=ADR",
      // { withCredentials: true }
    )
    .then(({ data }) => {
      const { ui_schema: uiSchema, json_schema: jsonSchema } = data;

      return { uiSchema, jsonSchema };
    });

export const useADRSchemaQuery = () => {
  const { isLoading, data } = useQuery("adrSchema", getAdrSchema);

  return { isLoading, data };
};
