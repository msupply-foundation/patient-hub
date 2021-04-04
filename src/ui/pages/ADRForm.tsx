import adrSchema from "../../json/adr-schema.json";
import adrUI from "../../json/adr-ui.json";
import { Paper } from "@material-ui/core";
import { JsonSchemaForm } from "../components";
import { FC } from "react";

const SubmitForm = ({ formData }: { formData: any }, e: any) => {
  console.log("Data submitted: ", formData);
};

export const ADRForm: FC = () => {
  return (
    <Paper
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: 600,
        padding: 50,
      }}
    >
      <JsonSchemaForm
        schema={adrSchema}
        uiSchema={adrUI}
        onSubmit={SubmitForm}
      />
    </Paper>
  );
};
