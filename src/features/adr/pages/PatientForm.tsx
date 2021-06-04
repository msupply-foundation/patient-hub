import { ChangeEvent, FC, useEffect, useMemo, useState } from "react";
import {
  Button,
  CircularProgress,
  Paper,
  TextField,
  Grid,
  TextFieldProps,
} from "@material-ui/core";
import { DatePicker } from "@material-ui/lab";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import enLocale from "date-fns/locale/en-NZ";
import { PatientList } from "../components/PatientList";

import { stylesFactory } from "../../../shared/utils";
import { StepperContainer } from "../../../shared/components/stepper/StepperContainer";
import { useStep, useTranslations } from "../../../shared/hooks";
import { usePatientLookup } from "../../patients/hooks";
import { isValid, parse } from "date-fns";
import { Patient, SearchParameters } from '../types';

const useStyles = stylesFactory({
  fieldContainer: { paddingBottom: 10 },
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

export interface PatientFormProps {
  onSubmit: (data: any) => void;
  step: number;
}

const initialSearchParams: SearchParameters = {
  firstName: "",
  lastName: "",
  dateOfBirth: null,
};

export const PatientForm: FC<PatientFormProps> = ({ onSubmit, step }) => {
  const classes = useStyles();
  const { data, setData } = useStep(step);
  const [searchParams, setSearchParams] = useState(initialSearchParams);
  const { messages } = useTranslations();
  const onNextHook = () => {
    if (!data?.patient?.ID) return false;

    refresh();
    setSearchParams(initialSearchParams);
    return true;
  };
  const onFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ ...searchParams, firstName: event.target.value });
  };
  const onLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ ...searchParams, lastName: event.target.value });
  };

  const onDateChange = (
    dateValue?: Date | null | undefined,
    stringValue?: string
  ) => {
    const dateOfBirth =
      dateValue || parse(stringValue || "", "dd/MM/yyyy", new Date());
    setSearchParams({ ...searchParams, dateOfBirth });
  };

  const {
    data: patientData,
    error,
    noMore,
    loading,
    searchedWithNoResults,
    searchOnline,
    searchMore,
    refresh,
  } = usePatientLookup();

  const onSelect = (patient: Patient) => {
    const { ID, name } = patient;
    setData({ patient: { ID, name } });
  };

  const onWaypoint = () => {
    if (noMore || loading) return;
    searchMore(searchParams);
  };

  const hasNoSearchParams = useMemo(() => {
    const { firstName, lastName, dateOfBirth } = searchParams || {};
    return !firstName && !lastName && !isValid(dateOfBirth);
  }, [searchParams]);

  const lookupPatients = useMemo(
    () => () => {
      if (loading || hasNoSearchParams) return;
      searchOnline(searchParams);
    },
    [searchOnline, hasNoSearchParams, loading, searchParams]
  );

  useEffect(() => {
    const listener = (event: any) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        lookupPatients();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [lookupPatients]);

  return (
    <StepperContainer
      onSubmit={onSubmit}
      canContinue={true}
      onNextHook={onNextHook}
    >
      <Paper className={classes.paper}>
        <img className={classes.img} alt="logo" src="/patient_hub/logo.png" />
        <Grid container direction="row" justifyContent="space-around">
          <Grid item>
            <Grid container direction="column" alignItems="stretch">
              <Grid item className={classes.fieldContainer}>
                <TextField
                  label={messages.firstName}
                  fullWidth
                  onChange={onFirstNameChange}
                  value={searchParams.firstName}
                >
                  {messages.firstName}
                </TextField>
              </Grid>
              <Grid item className={classes.fieldContainer}>
                <TextField
                  label={messages.lastName}
                  fullWidth
                  onChange={onLastNameChange}
                  value={searchParams.lastName}
                >
                  {messages.lastName}
                </TextField>
              </Grid>
              <Grid item className={classes.fieldContainer}>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  locale={enLocale}
                >
                  <DatePicker
                    label={messages.dateOfBirth}
                    value={searchParams.dateOfBirth}
                    onChange={onDateChange}
                    renderInput={(params: TextFieldProps) => (
                      <TextField {...params} />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid
                item
                alignSelf="flex-end"
                className={classes.fieldContainer}
              >
                <Button
                  variant="outlined"
                  onClick={lookupPatients}
                  disabled={hasNoSearchParams || loading}
                >
                  {messages.lookup}
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item style={{ flex: 1, marginLeft: 25 }}>
            <PatientList
              data={patientData || []}
              error={error}
              searchedWithNoResults={searchedWithNoResults}
              selectedId={data?.patient?.ID}
              onSelect={onSelect}
              onWaypoint={onWaypoint}
            />
            <Grid className={classes.loadingIndicator}>
              {loading && <CircularProgress size={20} />}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </StepperContainer>
  );
};
