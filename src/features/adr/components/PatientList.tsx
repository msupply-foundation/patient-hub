import { FC } from "react";
import { Waypoint } from "react-waypoint";
import Alert from "@material-ui/core/Alert";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { stylesFactory } from "../../../shared/utils";
import { format, parse } from "date-fns";

interface PatientListProps {
  data: Patient[];
  error: Error | null;
  onSelect: (patient: Patient) => void;
  onWaypoint: () => void;
  searchedWithNoResults: boolean;
  selectedId?: string;
}

const useStyles = stylesFactory({
  container: {},
});

interface Patient {
  ID: string;
  name: string;
  date_of_birth: Date;
}

export const PatientList: FC<PatientListProps> = ({
  data,
  error,
  onSelect,
  searchedWithNoResults,
  selectedId,
  onWaypoint,
}) => {
  const classes = useStyles();
  const formatDoB = (dob: Date) => {
    const date = parse(`${dob}`.split("T")[0], "yyyy-MM-dd", new Date());
    return format(date, "dd/MM/yyyy");
  };

  if (error) return <Alert severity="error">{error.message}</Alert>;

  if (searchedWithNoResults) return <Alert severity="warning">No results for your search criteria</Alert>;

  if (!data.length) return null;

  return (
    <TableContainer className={classes.container}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell style={{ minWidth: 250 }}>Name</TableCell>
            <TableCell style={{ minWidth: 100 }}>Date of Birth</TableCell>
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
                <TableCell>{patient.name}</TableCell>
                <TableCell>{formatDoB(patient.date_of_birth)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Waypoint onPositionChange={onWaypoint} />
    </TableContainer>
  );
};
