import { FC, useState, useRef } from "react";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Paper,
  useMediaQuery,
} from "@material-ui/core";
import Ajv from "ajv";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { JsonSchemaForm } from "../../../shared/components";
import { usePatientSurveySchemaQuery } from "../hooks/usePatientSurveySchemaQuery";
import { usePatientSchemaQuery } from "../hooks/usePatientSchemaQuery";
import { usePatientApi } from "../hooks/usePatientApi";
import { usePatientEvent } from "../hooks/usePatientEvent";
import { useModal } from "../../../shared/hooks";
import { ModalKey } from "../../../shared/containers/ModalProvider";

const ajvErrors = require("ajv-errors");

const ajv = new Ajv({
  errorDataPath: "property",
  allErrors: true,
  multipleOfPrecision: 8,
  schemaId: "auto",
  unknownFormats: "ignore",
  jsonPointers: true,
});

ajvErrors(ajv);

const useStyles = makeStyles(() =>
  createStyles({
    backdrop: {
      zIndex: 100,
      color: "#fff",
    },
    img: {
      display: "flex",
      marginLeft: "auto",
      marginRight: "auto",
      maxWidth: "100%",
    },
    paper: {
      marginLeft: "auto",
      marginRight: "auto",
      maxWidth: 600,
      padding: 50,
    },
  })
);

type onChangeProps = {
  formData: any;
  errors: string[];
};

export const PatientForm: FC = () => {
  const { patientEvent } = usePatientEvent();
  const { open, close } = useModal(ModalKey.confirm);

  const {
    isLoading: patientSurveySchemaIsLoading,
    patientSurveySchema,
  } = usePatientSurveySchemaQuery();

  const {
    isLoading: patientSchemaIsLoading,
    patientSchema,
  } = usePatientSchemaQuery();

  const jsonPatientSchemaValidator = () => {
    if (patientSchema?.jsonSchema) {
      return ajv.compile(patientSchema?.jsonSchema);
    }
    return () => false;
  };

  const jsonPatientSurveySchemaValidator = () => {
    if (patientSurveySchema?.jsonSchema) {
      return ajv.compile(patientSurveySchema?.jsonSchema);
    }
    return () => false;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshForms, setRefreshForms] = useState(false);
  const classes = useStyles();

  const handleClose = () => {
    close();
    setRefreshForms((state) => !state);
  };

  const patientFormRef = useRef({ formData: {}, isValid: false });
  const surveyFormRef = useRef({ formData: {}, isValid: false });
  const { createPatient, createNameNote } = usePatientApi();

  const handleSubmit = () => {
    const patientValidator = jsonPatientSchemaValidator();
    const surveyValidator = jsonPatientSurveySchemaValidator();
    const patientIsValid = patientValidator(patientFormRef.current?.formData);
    const surveyIsValid = surveyValidator(surveyFormRef.current?.formData);

    if (surveyIsValid && patientIsValid) {
      setIsSubmitting(true);
      createPatient(patientFormRef?.current?.formData || {})
        .then(({ data }) =>
          createNameNote(
            data.ID,
            patientEvent?.id || "",
            surveyFormRef?.current?.formData
          )
        )
        .then(() => {
          open({
            handleClose,
            content:
              "Thank you for submitting your details and helping in the fight against COVID-19!",
          });
          setIsSubmitting(false);
        });
    }
  };

  const handlePatientChange = ({ formData, errors }: onChangeProps) => {
    if (patientFormRef?.current) {
      const isValid = errors.length === 0;
      patientFormRef.current = { formData, isValid };
    }
  };

  const handleSurveyChange = ({ formData, errors }: onChangeProps) => {
    if (surveyFormRef?.current) {
      const isValid = errors.length === 0;
      surveyFormRef.current = { formData, isValid };
    }
  };

  // The on submit function of the form which handles events such as focusing
  // fields which are not filled is triggered by clicking a button which has a
  // type of 'submit' as a child of the form. Since we have two form components
  // and we want each one to be validated with a single button, there is a
  // button child for each form. Where the second form is triggering a simulated
  // click on the first forms button, to trigger the on submit function for that form.
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const isSmallScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("sm")
  );

  return (
    <Paper
      className={classes.paper}
      style={{ padding: isSmallScreen ? 20 : 50 }}
    >
      <img className={classes.img} alt="logo" src="/patient_hub/logo.png" />

      {!patientSchemaIsLoading ? (
        <JsonSchemaForm
          id="patient"
          jsonSchema={patientSchema?.jsonSchema ?? {}}
          uiSchema={patientSchema?.uiSchema ?? {}}
          onChange={handlePatientChange}
          refresh={refreshForms}
        >
          <Button
            ref={buttonRef}
            variant="contained"
            color="primary"
            type="submit"
            onClick={() => "submit!"}
            style={{ display: "none" }}
          >
            Submit
          </Button>
        </JsonSchemaForm>
      ) : (
        <Box
          height="50vh"
          justifyContent="center"
          alignItems="center"
          flex={1}
          display="flex"
        >
          <CircularProgress />
        </Box>
      )}

      {!patientSurveySchemaIsLoading ? (
        <JsonSchemaForm
          onSubmit={handleSubmit}
          id="patientSurvey"
          jsonSchema={patientSurveySchema?.jsonSchema ?? {}}
          uiSchema={patientSurveySchema?.uiSchema ?? {}}
          onChange={handleSurveyChange}
          refresh={refreshForms}
        >
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={() => {
              buttonRef.current?.click();
            }}
          >
            Submit
          </Button>
        </JsonSchemaForm>
      ) : (
        <Box
          height="50vh"
          justifyContent="center"
          alignItems="center"
          flex={1}
          display="flex"
        >
          <CircularProgress />
        </Box>
      )}

      <Backdrop className={classes.backdrop} open={isSubmitting}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Paper>
  );
};
