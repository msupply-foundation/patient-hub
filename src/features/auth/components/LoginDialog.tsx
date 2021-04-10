import { FC, useState } from "react";
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
import { useAuth } from "../hooks/useAuth";
import { useLogin } from "../hooks/useLoginQuery";

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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, guestLogin } = useAuth();
  const { messages } = useTranslations();

  const { tryLogin, isLoading, error } = useLogin();

  return (
    <Dialog
      fullWidth
      open={open}
      onBackdropClick={canExit ? handleClose : undefined}
    >
      <Grid container direction="column">
        <Grid item xs={12}>
          <AppBar
            LeftComponent={
              <Typography style={{ color: "#4d4d4d" }}>Login</Typography>
            }
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
              <TextField
                fullWidth
                onChange={(event) => setUsername(event.target.value)}
                variant="outlined"
                label={messages.username}
              />
              <Box mt={2} />
              <TextField
                fullWidth
                onChange={(event) => setPassword(event.target.value)}
                variant="outlined"
                label={messages.password}
              />
            </Box>
            <Grid item xs={12}>
              <LoadingButton
                pending={isLoading}
                disabled={!(username && password)}
                fullWidth
                endIcon={<ChevronRight />}
                variant="contained"
                color="primary"
                onClick={async () => {
                  const authenticated = await tryLogin({ username, password });

                  if (authenticated) {
                    login(username, password);
                    handleClose();
                    setPassword("");
                    setUsername("");
                  }
                }}
              >
                {messages.signIn}
              </LoadingButton>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Box mt={1} />
            <Button
              disabled={isLoading}
              fullWidth
              endIcon={<ChevronRight />}
              variant="contained"
              color="primary"
              onClick={async () => {
                const authenticated = await tryLogin({
                  username: "guest",
                  password: "tonga-guest-road-skin-frisk",
                });

                if (authenticated) {
                  guestLogin();
                  handleClose();
                }
              }}
            >
              {messages.continueGuest}
            </Button>
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
