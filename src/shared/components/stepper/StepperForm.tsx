import { FC, useRef } from "react";
import { Paper } from "@material-ui/core";
import { stylesFactory } from "../../utils";
import { JsonSchemaForm } from "../JsonSchemaForm";
import { StepperContainer } from "./StepperContainer";
import { useIsSchemaValid } from "../../hooks";

interface StepperFormProps {
  uiSchema?: any;
  jsonSchema?: any;
  formData: any;
  onChange: (data: { formData: any }) => void;
  onSubmit: () => void;
}

const useStyles = stylesFactory({
  img: {
    display: "flex",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: "100%",
  },
  input: { display: "none" },
  paper: { padding: 20 },
});

export const StepperForm: FC<StepperFormProps> = ({
  uiSchema,
  jsonSchema,
  formData,
  onChange,
  onSubmit,
}) => {
  const classes = useStyles();
  const isValid = useIsSchemaValid(jsonSchema, formData);
  const submitRef = useRef<HTMLInputElement | null>(null);

  const onNextHook = () => {
    if (!isValid) {
      submitRef.current?.click();
    }
    return isValid;
  };

  return (
    <StepperContainer
      onSubmit={onSubmit}
      canContinue={true}
      onNextHook={onNextHook}
    >
      <Paper className={classes.paper}>
        <img className={classes.img} alt="logo" src="/patient_hub/logo.png" />

        <JsonSchemaForm
          formData={formData}
          jsonSchema={jsonSchema}
          uiSchema={uiSchema}
          onChange={onChange}
        >
          <input ref={submitRef} type="submit" className={classes.input} />
        </JsonSchemaForm>
      </Paper>
    </StepperContainer>
  );
};
