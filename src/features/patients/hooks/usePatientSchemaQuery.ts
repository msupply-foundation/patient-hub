import { useQuery } from "react-query";
import axios from "axios";
import { JSONSchema7 } from "json-schema";
import { useAuth } from "../../auth/hooks/useAuth";
import { getUrl } from '../../../shared/utils';

interface PatientSchemaResponseData {
  ui_schema: Record<string, string>;
  json_schema: JSONSchema7;
}

export const getPatientSchema = () =>
  axios
    .get<PatientSchemaResponseData[]>(getUrl('form_schema?type=PatientSurvey'), {
      withCredentials: true,
    })
    .then(({ data }) => {
      const { ui_schema: uiSchema, json_schema: jsonSchema } = data[0] ?? {};
      return { uiSchema, jsonSchema };
    });
};

export const usePatientSchemaQuery = () => {
  const { username } = useAuth();
  const { isLoading, data } = useQuery("patientSchema", getPatientSchema, {
    enabled: !!username,
    refetchInterval: false,
    staleTime: Infinity,
  });

  return { isLoading, patientSchema: data };
};
