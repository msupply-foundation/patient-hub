import { ChangeEvent, FC, MouseEvent, useState } from "react";
import { Button, Paper, TextField, Grid } from "@material-ui/core";
import { stylesFactory } from "../../../shared/utils";
import { StepperContainer } from "../../../shared/components/stepper/StepperContainer";
import { useIsSchemaValid, useStep } from "../../../shared/hooks";

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
  paper: {
    padding: 20,
    minHeight: "100vh",
    display: "flex",
    alignItems: "flex-start",
  },
});

export const PatientForm: FC<PatientFormProps> = ({ onSubmit, step }) => {
  const classes = useStyles();
  const { data, setData } = useStep(step);
  const isValid = true; // useIsSchemaValid(jsonSchema, data);
  //   const submitRef = useRef<HTMLInputElement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const onNextHook = () => isValid;
  const lookupPatients = (event: MouseEvent) => console.info(searchTerm);
  const onSearchTermChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
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
          direction="column"
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
              label="Search for patients"
              fullWidth
              onChange={onSearchTermChange}
            >
              Search term
            </TextField>
          </Grid>
          <Grid>
            <Button variant="outlined" onClick={lookupPatients} disabled={!searchTerm}>
              Lookup
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </StepperContainer>
  );
};
