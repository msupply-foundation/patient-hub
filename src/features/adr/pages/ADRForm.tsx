import { Skeleton } from "@material-ui/core";
import { FC } from "react";
import { useADRSchemaQuery } from "./hooks/useADRSchemaQuery";
import {
  useLoadingSpinner,
  useTranslations,
  useModal,
} from "../../../shared/hooks";
import { useSubmitADR } from "./hooks";
import { Box } from "@material-ui/core";
import { Stepper } from "../../../shared/components/stepper/Stepper";
import { StepperForm } from "../../../shared/components/stepper/StepperForm";
import { PatientForm } from "./PatientForm";
import { ModalKey } from "../../../shared/containers/ModalProvider";

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

  const onSubmit = (data: any[]) => {
    const { patient } = data[0];
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
          <PatientForm step={0} onSubmit={onSubmit} key="patient" />,

          <StepperForm
            step={1}
            onSubmit={onSubmit}
            key="adr"
            jsonSchema={data?.jsonSchema ?? {}}
            uiSchema={data?.uiSchema ?? {}}
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
