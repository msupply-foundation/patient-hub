import { ChangeEvent, FC, MouseEvent, useState } from "react";
import {
  Button,
  CircularProgress,
  Paper,
  TextField,
  Grid,
} from "@material-ui/core";
import { PatientList } from "../components/PatientList";

import { stylesFactory } from "../../../shared/utils";
import { StepperContainer } from "../../../shared/components/stepper/StepperContainer";
import { useIsSchemaValid, useStep } from "../../../shared/hooks";
import { usePatientLookup } from "../../patients/hooks";

interface PatientFormProps {
  onSubmit: (data: any) => void;
  step: number;
}

const useStyles = stylesFactory({
  img: {
    display: "flex",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: "100%",
  },
  input: { display: "none" },
  loadingIndicator: { textAlign: "center", padding: 15 },
  paper: {
    padding: 20,
    minHeight: "100vh",
    display: "flex",
    alignItems: "flex-start",
  },
});

// TODO: move this out somewhere..
interface Patient {
  ID: string;
  name: string;
  date_of_birth: Date;
}

const initialSearchParams = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
};
export const PatientForm: FC<PatientFormProps> = ({ onSubmit, step }) => {
  const classes = useStyles();
  const { data, setData } = useStep(step);
  //   const submitRef = useRef<HTMLInputElement | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearchParams);
  const onNextHook = () => !!data?.ID;
  const lookupPatients = (event: MouseEvent) => searchOnline(searchTerm);
  const onFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm({ ...searchTerm, firstName: event.target.value });
  };
  const onLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm({ ...searchTerm, lastName: event.target.value });
  };
  const onDoBChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm({ ...searchTerm, dateOfBirth: event.target.value });
  };
  const {
    data: patientData,
    error,
    gettingMore,
    loading,
    searchedWithNoResults,
    searchOnline,
  } = usePatientLookup();

  const onSelect = (patient: Patient) => {
    const { ID, name } = patient;
    setData({ patient: { ID, name } });
  };

  return (
    <StepperContainer
      onSubmit={onSubmit}
      canContinue={true}
      onNextHook={onNextHook}
    >
      <Paper className={classes.paper}>
        <Grid
          container
          direction="row"
          alignItems="stretch"
          justifyContent="flex-start"
        >
          <Grid item>
            <img
              className={classes.img}
              alt="logo"
              src="/patient_hub/logo.png"
            />
          </Grid>
          <Grid item>
            <TextField
              label="First name"
              fullWidth
              onChange={onFirstNameChange}
            >
              First name
            </TextField>
            <TextField label="Last name" fullWidth onChange={onLastNameChange}>
              Last name
            </TextField>
            <TextField label="Date of birth" fullWidth onChange={onDoBChange}>
              Date of Birth
            </TextField>
          </Grid>
          <Grid>
            <Button
              variant="outlined"
              onClick={lookupPatients}
              disabled={!searchTerm || loading}
            >
              Lookup
            </Button>
          </Grid>
          <Grid item>
            <PatientList
              data={patientData?.data || []}
              selectedId={data?.patient?.ID}
              onSelect={onSelect}
            />
          </Grid>
          <Grid className={classes.loadingIndicator}>
            {loading && <CircularProgress size={20} />}
          </Grid>
        </Grid>
      </Paper>
    </StepperContainer>
  );
};
