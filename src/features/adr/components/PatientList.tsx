import { FC } from "react";
import { Waypoint } from "react-waypoint";
import Alert from "@material-ui/core/Alert";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import { useTranslations } from "../../../shared/hooks";
import { format, parse } from "date-fns";

import { Patient } from '../../patients/types';

interface PatientListProps {
  data: Patient[];
  error?: Error;
  onSelect: (patient: Patient) => void;
  onWaypoint: () => void;
  searchedWithNoResults: boolean;
  selectedId?: string;
}

export const PatientList: FC<PatientListProps> = ({
  data,
  error,
  onSelect,
  searchedWithNoResults,
  selectedId,
  onWaypoint,
}) => {
  const { messages } = useTranslations();
  const formatDoB = (dob?: Date) => {
    if (!dob) return "";

    const date = parse(`${dob}`.split("T")[0], "yyyy-MM-dd", new Date());
    return format(date, "dd/MM/yyyy");
  };

  if (error) return <Alert severity="error">{error.message}</Alert>;

  if (searchedWithNoResults) return <Alert severity="warning">{messages.noPatientResults}</Alert>;

  if (!data.length) return null;

  return (
    <TableContainer>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell style={{ minWidth: 250 }}>{messages.name}</TableCell>
            <TableCell style={{ minWidth: 100 }}>{messages.dateOfBirth}</TableCell>
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
      <Waypoint onEnter={onWaypoint} scrollableAncestor={window} />
    </TableContainer>
  );
};
