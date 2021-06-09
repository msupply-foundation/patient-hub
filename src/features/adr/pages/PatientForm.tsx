import { FC, useState } from "react";
import { Button, Container, Paper, Typography } from "@material-ui/core";
import { PatientDetails, PatientLookup } from "../components";

import { stylesFactory } from "../../../shared/utils";
import { StepperContainer } from "../../../shared/components/stepper/StepperContainer";
import { useStep, useTranslations } from "../../../shared/hooks";
import { useAuth } from "../../auth/hooks";
import { Patient } from "../../patients/types";

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
}

export const PatientForm: FC<PatientFormProps> = ({ onSubmit, step }) => {
  const classes = useStyles();
  const { data, setData } = useStep(step);
  const { isGuest } = useAuth();
  const [canContinue, setCanContinue] = useState(false);
  const [manualEntry, setManualEntry] = useState(isGuest);
  const { messages } = useTranslations();

  const onNextHook = () => canContinue;
  const patient = data?.patient || { first: "", last: "", date_of_birth: null };
  const setPatient = (patient: Patient) => setData({ patient });

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
