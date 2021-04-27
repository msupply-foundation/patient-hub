import { Button, Paper, Skeleton } from "@material-ui/core";
import { JsonSchemaForm } from "../../../shared/components";
import { FC, useRef, useState } from "react";
import { useADRSchemaQuery } from "./hooks/useADRSchemaQuery";
import { stylesFactory } from "../../../shared/utils";
import { useIsSchemaValid, useLoadingSpinner } from "../../../shared/hooks";
import { useSubmitADR } from "./hooks";
import { Box } from "@material-ui/core";

const useStyles = stylesFactory({
  img: {
    display: "flex",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: "100%",
  },

  paper: {
    padding: 20,
    maxWidth: 600,
    minHeight: "100vh",
    display: "flex",
    alignItems: "flex-end",
    marginLeft: "auto",
    marginRight: "auto",
  },
});

export const ADRForm: FC = () => {
  const classes = useStyles();
  const submitRef = useRef<HTMLButtonElement | null>(null);
  const { isLoading, data } = useADRSchemaQuery();
  const [formData, setFormData] = useState({});
  const { toggleLoading } = useLoadingSpinner();
  const isValid = useIsSchemaValid(data?.jsonSchema ?? {}, formData);
  const { submit } = useSubmitADR();

  const onSubmit = async () => {
    if (!isValid) {
      submitRef.current?.click();
    } else {
      toggleLoading();
      await submit(formData);
      toggleLoading();
    }
  };

  return !isLoading ? (
    <Paper className={classes.paper}>
      <img className={classes.img} alt="logo" src="/patient_hub/logo.png" />

      <JsonSchemaForm
        formData={formData}
        jsonSchema={data?.jsonSchema ?? {}}
        uiSchema={data?.uiSchema ?? {}}
        onChange={({ formData }: { formData: any }) => setFormData(formData)}
      >
        <Button
          variant="contained"
          ref={submitRef}
          type="submit"
          onClick={onSubmit}
        >
          Submit
        </Button>
      </JsonSchemaForm>
    </Paper>
  ) : (
    <Box maxWidth={600} marginLeft="auto" marginRight="auto">
      <Skeleton height="100vh" variant="rectangular" />
    </Box>
  );
};
