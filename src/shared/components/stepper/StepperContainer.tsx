import { Box, Button, Grid, MobileStepper, Paper } from "@material-ui/core";
import { FC, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useStepper, useTranslations } from "../../hooks";
import { stylesFactory } from "../../utils";

const useStyles = stylesFactory({
  paper: { padding: 20, marginBottom: 20 },
});

interface StepperContainerProps {
  canContinue: boolean;
  onNextHook: () => boolean;
  onSubmit: (data: any) => void;
}

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
    data,
    reset,
  } = useStepper();
  const { messages } = useTranslations();
  const classes = useStyles();

  const onNext = () => {
    if (onNextHook()) {
      next();
    }
  };

  const submitCallback = async () => {
    if (onNextHook()) {
      await onSubmit(data);
      reset();
      setReady(false);
    }
  };

  const [ready, setReady] = useState(false);

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
                  {messages.back}
                </Button>
                {!ready && onLastStep ? (
                  <ReCAPTCHA
                    sitekey="6LeFCagaAAAAAM3_suPeXkMLmY77IDsy5f4s-fto"
                    onChange={(val) => setReady(true)}
                  />
                ) : (
                  <Button
                    disabled={!canContinue}
                    onClick={onLastStep ? submitCallback : onNext}
                    variant="outlined"
                  >
                    {onLastStep ? messages.submit : messages.next}
                  </Button>
                )}
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
              {onLastStep ? messages.submit : messages.next}
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
