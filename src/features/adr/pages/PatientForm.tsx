import { FC, useEffect, useState } from "react";
import { Button, Container, Paper, Typography } from "@material-ui/core";
import { PatientDetails, PatientLookup } from "../components";

import { stylesFactory } from "../../../shared/utils";
import { StepperContainer } from "../../../shared/components/stepper/StepperContainer";
import { useStep, useTranslations } from "../../../shared/hooks";
import { useAuth } from "../../auth/hooks";
import { Patient, PatientHistory, Transaction } from "../../patients/types";
import { usePatientHistory } from "../../patients/hooks";
import { MessageFormatElement } from "react-intl";
import { JSONSchema7, JSONSchema7Type } from "json-schema";

const useStyles = stylesFactory({
  footer: {
    display: "flex!important",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    display: "flex",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: "100%",
  },
  paper: {
    alignItems: "flex-start",
    display: "flex",
    flexWrap: "wrap",
    minHeight: "50vh",
    padding: 20,
  },
});

export interface PatientFormProps {
  onSubmit: (data: any) => void;
  step: number;
  jsonSchema: any;
  patientName?: string;
  setJsonSchema: any;
}

const mapHistory = (
  history: PatientHistory[],
  messages: Record<string, string> | Record<string, MessageFormatElement[]>
) =>
  history
    .filter((h) => h.transLines.some((t) => t.itemLine?.item?.is_vaccine))
    .map((h, index) => {
      const transLine = h.transLines.length
        ? h.transLines[0]
        : ({} as Transaction);
      const { medicineAdministrator, item_name = "" } = transLine;
      const n = index + 1;
      const vaccinator = medicineAdministrator
        ? `  ${messages.vaccinator}: ${medicineAdministrator.first_name} ${medicineAdministrator.last_name}`
        : "";
      const name = `${n}. ${item_name}  ${messages.date}: ${h.confirm_date}${vaccinator}`;

      return { name, value: transLine.ID };
    });

interface JSONSchemaItems {
  enum?: JSONSchema7Type[];
  enumNames?: JSONSchema7Type[];
}

const getItems = (jsonSchema?: JSONSchema7) => {
  if (!jsonSchema) return undefined;

  const { properties = {} } = jsonSchema;
  const { causes = {} } = properties;
  const { items } = causes as JSONSchema7;
  return items as JSONSchemaItems;
};

export const PatientForm: FC<PatientFormProps> = ({
  onSubmit,
  step,
  jsonSchema,
  patientName,
  setJsonSchema,
}) => {
  const classes = useStyles();
  const { data, setData } = useStep(step);
  const { isGuest } = useAuth();
  const [canContinue, setCanContinue] = useState(false);
  const [manualEntry, setManualEntry] = useState(isGuest);
  const [patient, setPatient] = useState(
    data?.patient || { first: "", last: "", date_of_birth: null }
  );
  const { messages } = useTranslations();
  const {
    loading: historyLoading,
    data: history,
    searched,
    searchOnline: historySearch,
  } = usePatientHistory();
  const items = getItems(jsonSchema);
  const onNextHook = () => canContinue;
  const setPatientData = (patient: Patient) => {
    if (data?.patient?.ID && data?.patient?.ID === patient.ID) return;
    setData({ patient });
    setPatient(patient);
    patientName = `${patient.first} ${patient.last}`;
    if (!historyLoading && !!items) historySearch(patient.ID);
  };

  useEffect(() => {
    if (!items) {
      setJsonSchema(jsonSchema);
      return;
    }

    const mappedHistory = history.length
      ? mapHistory(history, messages)
      : [{ name: messages.noVaccinationHistory, value: "" }];

    items.enum = mappedHistory.map((h) => h.value);
    items.enumNames = mappedHistory.map((h) => h.name as string);

    if (searched) setJsonSchema(jsonSchema);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, patient.ID, searched]);

  return (
    <StepperContainer
      onSubmit={onSubmit}
      canContinue={true}
      onNextHook={onNextHook}
    >
      <Paper className={classes.paper}>
        <img className={classes.img} alt="logo" src="/patient_hub/logo.png" />
        {manualEntry ? (
          <PatientDetails
            setCanContinue={setCanContinue}
            patient={patient}
            setPatient={setPatientData}
          />
        ) : (
          <>
            <PatientLookup
              setCanContinue={setCanContinue}
              patient={patient}
              setPatient={setPatientData}
            />
            <Container className={classes.footer}>
              <Typography mr={2}>{messages.cantFindPatient}</Typography>
              <Button variant="outlined" onClick={() => setManualEntry(true)}>
                {messages.addManualEntry}
              </Button>
            </Container>
          </>
        )}
      </Paper>
    </StepperContainer>
  );
};
