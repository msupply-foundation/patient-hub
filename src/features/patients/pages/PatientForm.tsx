import { FC, useState } from "react";
import { Backdrop, CircularProgress, Paper } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { ConfirmationDialog } from "../../../shared/dialog";
import { JsonSchemaForm } from "../../../shared/components";
import patientSchema from "../../../json/patient-schema.json";
import patientUI from "../../../json/patient-ui.json";

const useStyles = makeStyles(() =>
  createStyles({
    backdrop: {
      zIndex: 100,
      color: "#fff",
    },
    paper: {
      marginLeft: "auto",
      marginRight: "auto",
      maxWidth: 600,
      padding: 50,
      overflow: "scroll",
      height: "calc(100% - 100px)",
    },
  })
);

export const PatientForm: FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const classes = useStyles();
  const onSubmit = ({ formData }: { formData: any }, e: any) => {
    setIsSubmitting(true);
    console.log("Data submitted: ", formData);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmation(true);
    }, 3000);
  };
  const handleClose = () => {
    setShowConfirmation(false);
  };

  return (
    <Paper className={classes.paper}>
      <JsonSchemaForm
        schema={patientSchema}
        uiSchema={patientUI}
        onSubmit={onSubmit}
      />
      <Backdrop className={classes.backdrop} open={isSubmitting}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <ConfirmationDialog
        open={showConfirmation}
        title="Success!"
        handleClose={handleClose}
      >
        Patient created successfully
      </ConfirmationDialog>
    </Paper>
  );
};
