import { FC, useState } from "react";
import { Paper } from "@material-ui/core";
import { PatientDetails, PatientLookup } from "../components";

import { stylesFactory } from "../../../shared/utils";
import { StepperContainer } from "../../../shared/components/stepper/StepperContainer";
import { useStep } from "../../../shared/hooks";
import { useAuth } from "../../auth/hooks";
import { Patient } from "../../patients/types";

const useStyles = stylesFactory({
  img: {
    display: "flex",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: "100%",
  },
  paper: {
    padding: 20,
    minHeight: "100vh",
    display: "flex",
    alignItems: "flex-start",
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

  const onNextHook = () => canContinue;
  const patient = data?.patient || {};
  const setPatient = (patient: Patient) => setData({ patient });

  return (
    <StepperContainer
      onSubmit={onSubmit}
      canContinue={true}
      onNextHook={onNextHook}
    >
      <Paper className={classes.paper}>
        <img className={classes.img} alt="logo" src="/patient_hub/logo.png" />
        {isGuest ? (
          <PatientDetails
            setCanContinue={setCanContinue}
            patient={patient}
            setPatient={setPatient}
          />
        ) : (
          <PatientLookup
            setCanContinue={setCanContinue}
            patient={patient}
            setPatient={setPatient}
          />
        )}
      </Paper>
    </StepperContainer>
  );
};
