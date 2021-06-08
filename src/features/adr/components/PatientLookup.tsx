import { ChangeEvent, FC, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  TextFieldProps,
  Typography,
} from "@material-ui/core";
import { DatePicker } from "@material-ui/lab";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import enLocale from "date-fns/locale/en-NZ";
import { PatientList } from "../components/PatientList";

import { stylesFactory } from "../../../shared/utils";
import { useTranslations } from "../../../shared/hooks";
import { usePatientLookup } from "../../patients/hooks";
import { isValid, parse } from "date-fns";
import { Patient, SearchParameters } from "../../patients/types";

const useStyles = stylesFactory({
  loadingIndicator: { textAlign: "center", padding: 15 },
});

export interface PatientLookupProps {
  patient: Patient;
  setCanContinue: (canContinue: boolean) => void;
  setPatient: (patient: Patient) => void;
}

const initialSearchParams: SearchParameters = {
  firstName: "",
  lastName: "",
  dateOfBirth: null,
};

export const PatientLookup: FC<PatientLookupProps> = ({
  patient,
  setCanContinue,
  setPatient,
}) => {
  const classes = useStyles();
  const [searchParams, setSearchParams] = useState(initialSearchParams);
  const { messages } = useTranslations();

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
  } = usePatientLookup();

  const onSelect = (patient: Patient) => {
    const { ID, name } = patient;
    setPatient({ ID, name });
    setCanContinue(true);
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
    <Grid container direction="row" justifyContent="space-around">
      <Grid item xs={12} md={4} xl={1}>
        <Box mb={1} mt={1}>
          <Typography variant="h6">{messages.searchForPatient}</Typography>
          <Divider />
        </Box>
        <Grid item direction="column" alignItems="stretch">
          <Box mb={1} mt={1}>
            <TextField
              label={messages.firstName}
              fullWidth
              onChange={onFirstNameChange}
              value={searchParams.firstName}
            />
          </Box>
          <Box mb={1} mt={1}>
            <TextField
              label={messages.lastName}
              fullWidth
              onChange={onLastNameChange}
              value={searchParams.lastName}
            >
              {messages.lastName}
            </TextField>
          </Box>
          <Box mb={1} mt={1}>
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
          </Box>
          <Grid item alignSelf="flex-end" xs={12}>
            <Box mb={1} mt={1}>
              <Button
                variant="outlined"
                onClick={lookupPatients}
                disabled={hasNoSearchParams || loading}
              >
                {messages.lookup}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item flex={1} xs={12} md={6} xl={1}>
        <PatientList
          data={patientData || []}
          error={error}
          searchedWithNoResults={searchedWithNoResults}
          selectedId={patient?.ID}
          onSelect={onSelect}
          onWaypoint={onWaypoint}
        />
        <Grid className={classes.loadingIndicator}>
          {loading && <CircularProgress size={20} />}
        </Grid>
      </Grid>
    </Grid>
  );
};
