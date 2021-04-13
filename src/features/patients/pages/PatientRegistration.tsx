import { FC, useState } from "react";
import { Skeleton } from "@material-ui/core";
import {
  usePatientApi,
  usePatientEvent,
  usePatientSurveySchemaQuery,
  usePatientSchemaQuery,
} from "../hooks";
import { useLoadingSpinner, useModal } from "../../../shared/hooks";
import { Stepper } from "../../../shared/components/stepper/Stepper";
import { StepperForm } from "../../../shared/components/stepper/StepperForm";
import { ModalKey } from "../../../shared/containers/ModalProvider";

export const PatientRegistration: FC = () => {
  const [formData, setFormData] = useState<Record<number, any>>({});
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

  const onChange = (index: number) => ({ formData }: { formData: any }) => {
    setFormData((state) => ({ ...state, [index]: formData }));
  };

  const { createPatient, createNameNote } = usePatientApi();

  const onSubmit = () => {
    toggleLoading();
    createPatient(formData[0])
      .then(({ data }) =>
        createNameNote(data.ID, patientEvent?.id || "", formData[1])
      )
      .then(() => {
        open({
          handleClose: close,
          content:
            "Thank you for submitting your details and helping in the fight against COVID-19!",
        });
        toggleLoading();
      });
  };

  return (
    <Stepper labels={["Patient Details", "Extra Information"]}>
      {!schemasLoading ? (
        [
          <StepperForm
            onSubmit={onSubmit}
            onChange={onChange(0)}
            formData={formData[0]}
            key="patient"
            jsonSchema={patientSchema?.jsonSchema ?? {}}
            uiSchema={patientSchema?.uiSchema ?? {}}
          />,
          <StepperForm
            onSubmit={onSubmit}
            onChange={onChange(1)}
            formData={formData[1]}
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
