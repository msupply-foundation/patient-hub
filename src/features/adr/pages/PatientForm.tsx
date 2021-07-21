import { FC, useEffect, useState } from "react";
import { Button, Container, Paper, Typography } from "@material-ui/core";
import { PatientDetails, PatientLookup } from "../components";

import { stylesFactory } from "../../../shared/utils";
import { StepperContainer } from "../../../shared/components/stepper/StepperContainer";
import { useStep, useTranslations } from "../../../shared/hooks";
import { useAuth } from "../../auth/hooks";
import { Patient, PatientHistory, Transaction } from "../../patients/types";
import { usePatientHistory } from "../../patients/hooks";

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

const mapHistory = (history: PatientHistory[]) =>
  history
    .filter((h) => h.transLines.some((t) => t.itemLine.item.is_vaccine))
    .map((h, index) => {
      const transLine = h.transLines.length
        ? h.transLines[0]
        : ({} as Transaction);
      const { medicineAdministrator, item_name = "" } = transLine;
      const vaccinator = medicineAdministrator
        ? `  Vaccinator: ${medicineAdministrator.first_name} ${medicineAdministrator.last_name}`
        : "";

      return `${index + 1}. ${item_name}  Date: ${h.confirm_date}${vaccinator}`;
    });

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

  const onNextHook = () => canContinue;
  const setPatientData = (patient: Patient) => {
    if (data?.patient?.ID === patient.ID) return;
    setData({ patient });
    setPatient(patient);
    patientName = `${patient.first} ${patient.last}`;
    if (!historyLoading) historySearch(patient.ID);
  };

  useEffect(() => {
    if (!jsonSchema) return;

    const { properties = {} } = jsonSchema;
    const { causes = {} } = properties;
    const { items = {} } = causes;

    if (!items) {
      setJsonSchema(jsonSchema);
      return;
    }

    items.enum = history.length
      ? mapHistory(history)
      : ["No vaccination history"];

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
