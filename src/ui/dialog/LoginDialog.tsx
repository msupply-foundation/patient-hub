import { FC, useState } from "react";
import { useQuery } from "react-query";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { Box, Grid, TextField } from "@material-ui/core";
import { ChevronRight } from "@material-ui/icons";
import { useTranslations } from "../hooks/useTranslations";
import { AppBar } from "../components/AppBar";
import { useAuth } from "../hooks/useAuth";
import { LoadingButton } from "@material-ui/lab";

interface LoginDialogProps {
  open: boolean;
  handleClose: () => void;
}

export const LoginDialog: FC<LoginDialogProps> = ({ open, handleClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, guestLogin } = useAuth();
  const { messages } = useTranslations();

  const { isLoading, isFetching, error, data, refetch } = useQuery(
    "login",
    () =>
      window
        .fetch(
          "https://t2ytl2iqse.execute-api.ap-southeast-2.amazonaws.com/default/login"
        )
        .then((resp) => console.log(resp)),
    { enabled: false }
  );

  return (
    <Dialog fullWidth open={open}>
      <Grid container direction="column">
        <Grid item xs={12}>
          <AppBar
            RightComponent={
              // <IconButton onClick={handleClose}>
              //   <Cancel />
              // </IconButton>
              null
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
                pending={isFetching}
                disabled={!(username && password)}
                fullWidth
                endIcon={<ChevronRight />}
                variant="contained"
                color="primary"
                onClick={async () => {
                  await refetch();
                  login(username, password);
                  handleClose();
                  setPassword("");
                  setUsername("");
                }}
              >
                {messages.signIn}
              </LoadingButton>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Box mt={1} />
            <Button
              disabled={isFetching}
              fullWidth
              endIcon={<ChevronRight />}
              variant="contained"
              color="primary"
              onClick={() => {
                guestLogin();
                handleClose();
              }}
            >
              {messages.continueGuest}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
};
