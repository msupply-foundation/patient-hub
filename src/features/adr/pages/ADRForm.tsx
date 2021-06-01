import { Skeleton } from "@material-ui/core";
import { FC } from "react";
import { useADRSchemaQuery } from "./hooks/useADRSchemaQuery";
// import { stylesFactory } from "../../../shared/utils";
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

// const useStyles = stylesFactory({
//   img: {
//     display: "flex",
//     marginLeft: "auto",
//     marginRight: "auto",
//     maxWidth: "100%",
//   },

//   paper: {
//     padding: 20,
//     maxWidth: 600,
//     minHeight: "100vh",
//     display: "flex",
//     alignItems: "flex-end",
//     marginLeft: "auto",
//     marginRight: "auto",
//   },
// });

export const ADRForm: FC = () => {
  const { messages } = useTranslations();
  const { isLoading, data } = useADRSchemaQuery();
  const { toggleLoading } = useLoadingSpinner();
  const { submit } = useSubmitADR();
  const { open, close } = useModal(ModalKey.confirm);
  const handleClose = () => close();

  const onSubmit = (data: any[]) => {
    const formData = { ...data[0], ...data[1] };
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
