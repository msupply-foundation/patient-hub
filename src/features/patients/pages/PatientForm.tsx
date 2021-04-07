import { FC, useState } from 'react';
import { Backdrop, Button, CircularProgress, Paper } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { ConfirmationDialog } from '../../../shared/dialog';
import { JsonSchemaForm } from '../../../shared/components';
import patientSchema from '../../../json/patient-schema.json';
import patientDetailsSchema from '../../../json/patient-details-schema.json';
import patientUI from '../../../json/patient-ui.json';
import patientDetailsUI from '../../../json/patient-details-ui.json';
import { usePatientSchema } from '../hooks/usePatientSchema';

const useStyles = makeStyles(() =>
  createStyles({
    backdrop: {
      zIndex: 100,
      color: '#fff',
    },
    img: {
      display: 'flex',
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: '100%', 
    },
    paper: {
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: 600,
      padding: 50,
    },
  })
);

export const PatientForm: FC = () => {
  // const { isLoading, data } = usePatientSchema();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const classes = useStyles();
  const onSubmit = ({ formData }: { formData: any }, e: any) => {
    setIsSubmitting(true);
    console.log('Data submitted: ', formData);
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
      <img className={classes.img} src="logo.png" />

      <JsonSchemaForm schema={patientSchema ?? {}} uiSchema={patientUI ?? {}} onSubmit={onSubmit} >
        <div/>
      </JsonSchemaForm>

      <JsonSchemaForm
        schema={patientDetailsSchema ?? {}}
        uiSchema={patientDetailsUI ?? {}}
        onSubmit={onSubmit}
      >
        <Button variant="contained" color="primary" type="submit">Submit</Button>
      </JsonSchemaForm>

      <Backdrop className={classes.backdrop} open={isSubmitting}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <ConfirmationDialog open={showConfirmation} title="Success!" handleClose={handleClose}>
        Patient created successfully
      </ConfirmationDialog>
    </Paper>
  );
};
