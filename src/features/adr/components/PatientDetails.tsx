import { ChangeEvent, FC, useEffect } from "react";
import {
  Box,
  Divider,
  Grid,
  TextField,
  TextFieldProps,
  Typography,
} from "@material-ui/core";
import { DatePicker, LocalizationProvider } from "@material-ui/lab";

import { Patient } from "../../patients/types";
import { useTranslations } from "../../../shared/hooks";
import { stylesFactory } from "../../../shared/utils";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import { parse } from "date-fns";
import enLocale from "date-fns/locale/en-NZ";

const useStyles = stylesFactory({
  fieldContainer: { paddingBottom: 10 },
});

interface PatientDetailsProps {
  patient: Patient;
  setCanContinue: (canContinue: boolean) => void;
  setPatient: (patient: Patient) => void;
}

export const PatientDetails: FC<PatientDetailsProps> = ({
  patient,
  setCanContinue,
  setPatient,
}) => {
  const { messages } = useTranslations();
  const classes = useStyles();

  useEffect(
    () => setCanContinue(!!patient.last && !!patient.first),
    [setCanContinue, patient]
  );

  const onLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const last = event.target.value;
    setPatient({ ...patient, last });
  };

  const onFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const first = event.target.value;
    setPatient({ ...patient, first });
  };

  const onDateChange = (
    dateValue?: Date | null | undefined,
    stringValue?: string
  ) => {
    const date_of_birth =
      dateValue || parse(stringValue || "", "dd/MM/yyyy", new Date());
    setPatient({ ...patient, date_of_birth });
  };

  return (
    <Grid container direction="column">
      <Box mb={1} mt={1}>
        <Typography variant="h5">{messages.patientDetails}</Typography>
        <Divider />
      </Box>
      <Grid item className={classes.fieldContainer}>
        <TextField
          label={messages.firstName}
          fullWidth
          onChange={onFirstNameChange}
          value={patient.first}
        >
          {messages.firsstName}
        </TextField>
      </Grid>
      <Grid item className={classes.fieldContainer}>
        <TextField
          label={messages.lastName}
          fullWidth
          onChange={onLastNameChange}
          value={patient.last}
        >
          {messages.lastName}
        </TextField>
      </Grid>
      <Grid item className={classes.fieldContainer}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={enLocale}>
          <DatePicker
            label={messages.dateOfBirth}
            value={patient.date_of_birth}
            onChange={onDateChange}
            renderInput={(params: TextFieldProps) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Grid>
    </Grid>
  );
};
