import axios from "axios";
import { useMutation } from "react-query";
import { getUrl } from "../../../../shared/utils";
import { useADRSchemaQuery } from "./useADRSchemaQuery";

export const submitADR = (formSchemaID: string) => (adr: any) => {
  const { patient } = adr;
  return axios.post(
    getUrl("adverse_drug_reaction"),
    { data: adr, form_schema_ID: formSchemaID, name_ID: patient?.ID },
    {
      withCredentials: true,
    }
  );
};

export const useSubmitADR = () => {
  const { data } = useADRSchemaQuery();
  const { mutate } = useMutation(submitADR(data?.id ?? ""));
  return { submit: mutate };
};
