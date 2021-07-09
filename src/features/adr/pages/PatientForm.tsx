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
}) => {
  const classes = useStyles();
  const { data, setData } = useStep(step);
  const { isGuest } = useAuth();
  const [canContinue, setCanContinue] = useState(false);
  const [manualEntry, setManualEntry] = useState(isGuest);
  const { messages } = useTranslations();
  const {
    loading: historyLoading,
    data: history,
    searchOnline: historySearch,
  } = usePatientHistory();

  const onNextHook = () => canContinue;
  const patient = data?.patient || { first: "", last: "", date_of_birth: null };
  const setPatient = (patient: Patient) => {
    setData({ patient });
    patientName = `${patient.first} ${patient.last}`;
    if (!historyLoading) historySearch(patient.ID);
  };

  useEffect(() => {
    const newHistory = history.length
      ? mapHistory(history)
      : ["No vaccinations recorded"];

    const { properties = {} } = jsonSchema;
    const { causes = {} } = properties;
    const { items = {} } = causes;

    items.enum = newHistory;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, patient.ID]);

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
            setPatient={setPatient}
          />
        ) : (
          <>
            <PatientLookup
              setCanContinue={setCanContinue}
              patient={patient}
              setPatient={setPatient}
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
