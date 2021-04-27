import { FC } from "react";
import { Skeleton } from "@material-ui/core";
import {
  usePatientApi,
  usePatientEvent,
  usePatientSurveySchemaQuery,
  usePatientSchemaQuery,
} from "../hooks";
import {
  useLoadingSpinner,
  useModal,
  useTranslations,
} from "../../../shared/hooks";
import { Stepper } from "../../../shared/components/stepper/Stepper";
import { StepperForm } from "../../../shared/components/stepper/StepperForm";
import { ModalKey } from "../../../shared/containers/ModalProvider";

export const PatientRegistration: FC = () => {
  const { messages } = useTranslations();
  const { patientEvent } = usePatientEvent();
  const { toggleLoading } = useLoadingSpinner();
  const { open, close } = useModal(ModalKey.confirm);

  const {
    isLoading: patientSurveySchemaIsLoading,
    patientSurveySchema,
  } = usePatientSurveySchemaQuery();

  const {
    isLoading: patientSchemaIsLoading,
    patientSchema,
  } = usePatientSchemaQuery();

  const schemasLoading = patientSchemaIsLoading && patientSurveySchemaIsLoading;

  const { createPatient, createNameNote } = usePatientApi();

  const handleClose = () => {
    close();
  };

  const onSubmit = async (data: any) => {
    toggleLoading();
    const patientData = await createPatient(data[0]);
    await createNameNote(patientData.data.ID, patientEvent?.id || "", data[1]);
    toggleLoading();
    open({
      handleClose,
      content: messages.thanks,
    });
  };

  return (
    <Stepper
      labels={[messages.patientDetails as string, messages.extraInfo as string]}
    >
      {!schemasLoading ? (
        [
          <StepperForm
            step={0}
            onSubmit={onSubmit}
            key="patient"
            jsonSchema={patientSchema?.jsonSchema ?? {}}
            uiSchema={patientSchema?.uiSchema ?? {}}
          />,

          <StepperForm
            step={1}
            onSubmit={onSubmit}
            key="survey"
            jsonSchema={patientSurveySchema?.jsonSchema ?? {}}
            uiSchema={patientSurveySchema?.uiSchema ?? {}}
          />,
        ]
      ) : (
        <Skeleton height="100vh" variant="rectangular" />
      )}
    </Stepper>
  );
};
