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

interface PatientListProps {
  data: Patient[],
  onSelect: (patient: Patient) => void,
  selectedId?: string,
}

const useStyles = stylesFactory({
  container: {
},
});

interface Patient {
  ID: string;
  name: string;
  date_of_birth: Date;
}

export const PatientList: FC<PatientListProps> = ({data, onSelect, selectedId}) => {
 const classes = useStyles();

  return (

            <TableContainer className={classes.container}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                      <TableCell style={{ minWidth: 250 }}>
                        Name
                      </TableCell>
                      <TableCell style={{ minWidth: 100 }}>
                        Date of Birth
                      </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((patient) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={patient.ID}
                        style={{ cursor: "pointer" }}
                        onClick={() => onSelect(patient)}
                        selected={patient.ID === selectedId}
                      >
                          <TableCell>
                              {patient.name}
                            </TableCell>
                            <TableCell>
                              {patient.date_of_birth}
                            </TableCell>
                        
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
         
  );
};
