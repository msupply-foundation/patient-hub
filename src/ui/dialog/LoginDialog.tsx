import { FC, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { Box, Grid, TextField } from "@material-ui/core";
import { ChevronRight } from "@material-ui/icons";
import { useTranslations } from "../hooks/useTranslations";
import { AppBar } from "../components/AppBar";
import { useAuth } from "../hooks/useAuth";

interface LoginDialogProps {
  open: boolean;
  handleClose: () => void;
}

export const LoginDialog: FC<LoginDialogProps> = ({ open, handleClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, guestLogin } = useAuth();
  const { messages } = useTranslations();

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
              <Button
                disabled={!(username && password)}
                fullWidth
                endIcon={<ChevronRight />}
                variant="contained"
                color="primary"
                onClick={() => {
                  login(username, password);
                  handleClose();
                }}
              >
                {messages.signIn}
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Box mt={1} />
            <Button
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
