import { FC, KeyboardEvent } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import {
  Box,
  Grid,
  TextField,
  Snackbar,
  Typography,
  IconButton,
} from "@material-ui/core";
import { ChevronRight, Close } from "@material-ui/icons";
import { LoadingButton } from "@material-ui/lab";
import { useTranslations } from "../../../shared/hooks/useTranslations";
import { AppBar } from "../../../shared/components/AppBar";
import { useLoginQuery, useLoginForm, useAuth } from "../hooks";
import { useConfig } from "../../../shared/hooks";

export interface LoginDialogProps {
  open: boolean;
  handleClose: () => void;
  canExit?: boolean;
}

export const LoginDialog: FC<LoginDialogProps> = ({
  open,
  handleClose,
  canExit = false,
}) => {
  const { username, password, setUsername, setPassword, reset, isFilled } =
    useLoginForm();
  const { tryLogin, tryGuestLogin, isLoading, error } = useLoginQuery();
  const { login, guestLogin } = useAuth();
  const { allowGuestAccess } = useConfig();
  const { messages } = useTranslations();

  const onNormalLogin = async () => {
    if (isFilled) {
      const authenticated = await tryLogin({ username, password });

      if (authenticated) {
        login(username);
        handleClose();
        reset();
      }
    }
  };

  const onGuestLogin = async () => {
    const authenticated = await tryGuestLogin();

    if (authenticated) {
      guestLogin();
      handleClose();
    }
  };

  const onKeyPress = (event: KeyboardEvent<HTMLDivElement> | undefined) => {
    if (event?.key === "Enter") {
      event.preventDefault();
      onNormalLogin();
    }
  };

  return (
    <Dialog
      fullWidth
      open={open}
      onBackdropClick={canExit ? handleClose : undefined}
    >
      <Grid container direction="column">
        <Grid item xs={12}>
          <AppBar
            LeftComponent={<Typography>{messages.login}</Typography>}
            RightComponent={
              canExit ? (
                <IconButton onClick={handleClose}>
                  <Close />
                </IconButton>
              ) : null
            }
          />
        </Grid>
        <Grid container direction="row">
          <Grid item xs={12}>
            <Box flexDirection="column" display="flex" m={5}>
              <form>
                <TextField
                  autoComplete="username"
                  fullWidth
                  onChange={(event) => setUsername(event.target.value)}
                  variant="outlined"
                  label={messages.username}
                  onKeyPress={onKeyPress}
                />
                <Box mt={2} />
                <TextField
                  autoComplete="current-password"
                  type="password"
                  onKeyPress={onKeyPress}
                  fullWidth
                  onChange={(event) => setPassword(event.target.value)}
                  variant="outlined"
                  label={messages.password}
                />
              </form>
            </Box>
            <Grid item xs={12}>
              <LoadingButton
                pending={isLoading}
                disabled={!isFilled}
                fullWidth
                endIcon={<ChevronRight />}
                variant="contained"
                color="primary"
                onClick={onNormalLogin}
              >
                {messages.signIn}
              </LoadingButton>
              <Box mt={1} />
              {allowGuestAccess && (
                <Button
                  disabled={isLoading}
                  fullWidth
                  endIcon={<ChevronRight />}
                  variant="contained"
                  color="primary"
                  onClick={onGuestLogin}
                >
                  {messages.continueGuest}
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={!!error}
        autoHideDuration={6000}
        message={messages.invalidUsernameOrPassword}
        disableWindowBlurListener
      />
    </Dialog>
  );
};
