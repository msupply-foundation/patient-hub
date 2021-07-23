import { Skeleton } from "@material-ui/core";
import { FC, useState } from "react";
import { useADRSchemaQuery } from "./hooks/useADRSchemaQuery";
import {
  useLoadingSpinner,
  useTranslations,
  useModal,
  useStep,
} from "../../../shared/hooks";
import { useSubmitADR } from "./hooks";
import { Box } from "@material-ui/core";
import { Stepper } from "../../../shared/components/stepper/Stepper";
import { StepperForm } from "../../../shared/components/stepper/StepperForm";
import { PatientForm } from "./PatientForm";
import { ModalKey } from "../../../shared/containers/ModalProvider";

import { Typography } from "@material-ui/core";
import { useLayoutEffect } from "react";
import { Patient } from "../../patients/types";

const PatientName: FC = () => {
  const [patient, setPatient] = useState<Patient>();
  const { data = {} } = useStep(0);
  const { patient: newPatient } = data;

  useLayoutEffect(() => {
    if (newPatient) setPatient(newPatient);
  }, [newPatient]);

  return patient ? <Typography variant="h6">{patient.name}</Typography> : null;
};

export const ADRForm: FC = () => {
  const { messages } = useTranslations();
  const { isLoading, data } = useADRSchemaQuery();
  const { toggleLoading } = useLoadingSpinner();
  const { submit } = useSubmitADR();
  const { open, close } = useModal(ModalKey.confirm);
  const handleClose = () => {
    close();
    window.location.reload();
  };
  const [jsonSchema, setJsonSchema] = useState({});
  const onSubmit = (data: any[]) => {
    const { patient: lookupPatient = {} } = data[0];
    const { patient: schemaPatient = {} } = data[1];
    const patient = { ...lookupPatient, ...schemaPatient };
    const formData = { ...data[1], patient };
    toggleLoading();
    submit(formData);
    toggleLoading();
    open({
      handleClose,
      content: messages.ADRSubmitted,
    });
  };

  return (
    <Stepper
      labels={[messages.patientDetails as string, messages.aefi as string]}
    >
      {!isLoading ? (
        [
          <PatientForm
            step={0}
            onSubmit={onSubmit}
            key="patient"
            jsonSchema={data?.jsonSchema ?? {}}
            setJsonSchema={setJsonSchema}
          />,
          <StepperForm
            step={1}
            onSubmit={onSubmit}
            key="adr"
            jsonSchema={jsonSchema}
            uiSchema={data?.uiSchema ?? {}}
            title={<PatientName />}
          />,
        ]
      ) : (
        <Box maxWidth={600} marginLeft="auto" marginRight="auto">
          <Skeleton height="100vh" variant="rectangular" />
        </Box>
      )}
    </Stepper>
  );
};
