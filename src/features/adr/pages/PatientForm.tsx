import { ChangeEvent, FC, MouseEvent, useState } from "react";
import {
  Button,
  CircularProgress,
  Paper,
  TextField,
  Grid,
} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";

import { stylesFactory } from "../../../shared/utils";
import { StepperContainer } from "../../../shared/components/stepper/StepperContainer";
import { useIsSchemaValid, useStep } from "../../../shared/hooks";
import { usePatientLookup } from "../../patients/hooks";
import { format } from "date-fns";

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

interface Column {
  id: "name" | "date_of_birth";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: string) => string;
}

const columns: Column[] = [
  { id: "name", label: "Name", minWidth: 250 },
  { id: "date_of_birth", label: "Date of Birth", minWidth: 100 }, // format: (value: Date) => format(value, 'dd/MM/yyyy') },
];
interface PatientDataRow {
  ID: string;
  name: string;
  date_of_birth: Date;
}

export const PatientForm: FC<PatientFormProps> = ({ onSubmit, step }) => {
  const classes = useStyles();
  const { data, setData } = useStep(step);
  const isValid = true; // useIsSchemaValid(jsonSchema, data);
  //   const submitRef = useRef<HTMLInputElement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const onNextHook = () => isValid;
  const lookupPatients = (event: MouseEvent) =>
    searchOnline({ firstName: searchTerm });
  const onSearchTermChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const {
    data: patientData,
    error,
    gettingMore,
    loading,
    searchedWithNoResults,
    searchOnline,
  } = usePatientLookup();

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
            <Button
              variant="outlined"
              onClick={lookupPatients}
              disabled={!searchTerm || loading}
            >
              Lookup
            </Button>
          </Grid>
          <Grid item>
            <TableContainer className={classes.container}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(patientData?.data || []).map((row: PatientDataRow) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.ID}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === "string"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid className={classes.loadingIndicator}>
            {loading && <CircularProgress size={20} />}
          </Grid>
        </Grid>
      </Paper>
    </StepperContainer>
  );
};
