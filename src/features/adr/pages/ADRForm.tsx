import { Skeleton } from "@material-ui/core";
import { FC, useRef, useState } from "react";
import { useADRSchemaQuery } from "./hooks/useADRSchemaQuery";
import { stylesFactory } from "../../../shared/utils";
import {
  useIsSchemaValid,
  useLoadingSpinner,
  useTranslations,
} from "../../../shared/hooks";
import { useSubmitADR } from "./hooks";
import { Box } from "@material-ui/core";
import { Stepper } from "../../../shared/components/stepper/Stepper";
import { StepperForm } from "../../../shared/components/stepper/StepperForm";
import { PatientForm } from './PatientForm';

const useStyles = stylesFactory({
  img: {
    display: "flex",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: "100%",
  },

  paper: {
    padding: 20,
    maxWidth: 600,
    minHeight: "100vh",
    display: "flex",
    alignItems: "flex-end",
    marginLeft: "auto",
    marginRight: "auto",
  },
});

export const ADRForm: FC = () => {
  const { messages } = useTranslations();
  const classes = useStyles();
  const submitRef = useRef<HTMLButtonElement | null>(null);
  const { isLoading, data } = useADRSchemaQuery();
  const [formData, setFormData] = useState({});
  const { toggleLoading } = useLoadingSpinner();
  const isValid = useIsSchemaValid(data?.jsonSchema ?? {}, formData);
  const { submit } = useSubmitADR();

  const onSubmit = async () => {
    if (!isValid) {
      submitRef.current?.click();
    } else {
      toggleLoading();
      await submit(formData);
      toggleLoading();
    }
  };

  return  <Stepper
  labels={[messages.patientDetails as string, messages.aefi as string]}
>
  {!isLoading ? (
    [
      <PatientForm
        step={0}
        onSubmit={onSubmit}
        key="patient"
      />,

      <StepperForm
        step={1}
        onSubmit={onSubmit}
        key="adr"
        jsonSchema={data?.jsonSchema ?? {}}
        uiSchema={data?.uiSchema ?? {}}
      />,
    ]
      // <JsonSchemaForm
      //   formData={formData}
      //   jsonSchema={data?.jsonSchema ?? {}}
      //   uiSchema={data?.uiSchema ?? {}}
      //   onChange={({ formData }: { formData: any }) => setFormData(formData)}
      // >
      //   <Button
      //     variant="contained"
      //     ref={submitRef}
      //     type="submit"
      //     onClick={onSubmit}
      //   >
      //     {messages.submit}
      //   </Button>
      // </JsonSchemaForm>
  ) : (
    <Box maxWidth={600} marginLeft="auto" marginRight="auto">
      <Skeleton height="100vh" variant="rectangular" />
    </Box>
  )}
  </Stepper>
};
