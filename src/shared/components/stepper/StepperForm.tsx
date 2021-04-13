import { FC, useRef } from "react";
import { Paper } from "@material-ui/core";
import { stylesFactory } from "../../utils";
import { JsonSchemaForm } from "../JsonSchemaForm";
import { StepperContainer } from "./StepperContainer";
import { useIsSchemaValid, useStep } from "../../hooks";

interface StepperFormProps {
  uiSchema?: any;
  jsonSchema?: any;
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
  paper: { padding: 20 },
});

export const StepperForm: FC<StepperFormProps> = ({
  uiSchema,
  jsonSchema,
  onSubmit,
  step,
}) => {
  const classes = useStyles();
  const { data, setData } = useStep(step);
  const isValid = useIsSchemaValid(jsonSchema, data);
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
          formData={data}
          jsonSchema={jsonSchema}
          uiSchema={uiSchema}
          onChange={({ formData }: { formData: any }) => setData(formData)}
        >
          <input ref={submitRef} type="submit" className={classes.input} />
        </JsonSchemaForm>
      </Paper>
    </StepperContainer>
  );
};
