import { Box, Button, Grid, MobileStepper, Paper } from "@material-ui/core";
import { FC, useContext } from "react";
import { stylesFactory } from "../../utils";
import { StepperContext } from "./StepperContext";

const useStyles = stylesFactory({
  paper: { padding: 20, marginBottom: 20 },
});

interface StepperContainerProps {
  canContinue: boolean;
}

const useStepper = () => {
  const stepperState = useContext(StepperContext);
  return stepperState;
};

export const StepperContainer: FC<StepperContainerProps> = ({
  children,
  canContinue,
}) => {
  const { currentStep, next, back, labels } = useStepper();

  const classes = useStyles();

  return (
    <>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          {children}
        </Grid>
      </Grid>

      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Box display={{ xs: "none", md: "block" }} mt={2}>
            <Paper className={classes.paper} style={{ flex: 1 }}>
              <Box justifyContent="space-between" display="flex">
                <Button onClick={back} variant="outlined">
                  BACK
                </Button>
                <Button
                  disabled={!canContinue}
                  onClick={next}
                  variant="outlined"
                >
                  NEXT
                </Button>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      <Box display={{ md: "none" }}>
        <MobileStepper
          steps={labels.length}
          position="bottom"
          activeStep={currentStep}
          nextButton={
            <Button disabled={!canContinue} onClick={next} variant="outlined">
              NEXT
            </Button>
          }
          backButton={
            <Button onClick={back} variant="outlined">
              BACK
            </Button>
          }
        />
      </Box>
    </>
  );
};
