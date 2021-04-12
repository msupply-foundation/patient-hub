import { Box, Button, Grid, MobileStepper, Paper } from "@material-ui/core";
import { FC, useContext } from "react";
import { stylesFactory } from "../../utils";
import { StepperContext } from "./StepperContext";

const useStyles = stylesFactory({
  paper: { padding: 20, marginBottom: 20 },
});

interface StepperContainerProps {
  canContinue: boolean;
  onNextHook: () => boolean;
  onSubmit: () => void;
}

const useStepper = () => {
  const stepperState = useContext(StepperContext);
  return stepperState;
};

export const StepperContainer: FC<StepperContainerProps> = ({
  children,
  canContinue,
  onNextHook,
  onSubmit,
}) => {
  const {
    currentStep,
    next,
    back,
    labels,
    onFirstStep,
    onLastStep,
  } = useStepper();

  const classes = useStyles();

  const onNext = () => {
    if (onNextHook()) {
      next();
    }
  };

  const submitCallback = () => {
    if (onNextHook()) {
      onSubmit();
    }
  };

  return (
    <>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          {children}
        </Grid>
      </Grid>

      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Box display={{ xs: "none", sm: "block" }} mt={2}>
            <Paper className={classes.paper} style={{ flex: 1 }}>
              <Box
                justifyContent={onFirstStep ? "flex-end" : "space-between"}
                display="flex"
              >
                <Button
                  onClick={back}
                  variant="outlined"
                  style={{ display: onFirstStep ? "none" : "block" }}
                >
                  BACK
                </Button>
                <Button
                  disabled={!canContinue}
                  onClick={onLastStep ? submitCallback : onNext}
                  variant="outlined"
                >
                  {onLastStep ? "SUBMIT" : "NEXT"}
                </Button>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      <Box display={{ sm: "none" }}>
        <MobileStepper
          steps={labels.length}
          position="bottom"
          activeStep={currentStep}
          nextButton={
            <Button
              type="submit"
              disabled={!canContinue}
              onClick={onLastStep ? submitCallback : onNext}
              variant="outlined"
            >
              {onLastStep ? "SUBMIT" : "NEXT"}
            </Button>
          }
          backButton={
            <Button
              style={{ display: onFirstStep ? "none" : "block" }}
              onClick={back}
              variant="outlined"
            >
              BACK
            </Button>
          }
        />
      </Box>
    </>
  );
};
