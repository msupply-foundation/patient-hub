import { Box, Button, CircularProgress, Paper } from "@material-ui/core";
import { JsonSchemaForm } from "../../../shared/components";
import { FC } from "react";
import { useADRSchemaQuery } from "./hooks/useADRSchemaQuery";

const SubmitForm = ({ formData }: { formData: any }, e: any) => {
  console.log("Data submitted: ", formData);
};

export const ADRForm: FC = () => {
  const { isLoading, data } = useADRSchemaQuery();

  return (
    <Paper
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: 600,
        padding: 50,
      }}
    >
      {!isLoading ? (
        <JsonSchemaForm
          formData={{}}
          jsonSchema={data?.jsonSchema ?? {}}
          uiSchema={data?.uiSchema ?? {}}
          onSubmit={SubmitForm}
        >
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </JsonSchemaForm>
      ) : (
        <Box
          height="50vh"
          justifyContent="center"
          alignItems="center"
          flex={1}
          display="flex"
        >
          <CircularProgress />
        </Box>
      )}
    </Paper>
  );
};
