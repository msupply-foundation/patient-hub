import { useState } from "react";
import { Button, Grid, Paper, TextField, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import MsupplyMan from "../components/MsupplyMan";

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: "100%",
      height: "60vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    paper: {
      padding: 20,
      textAlign: "center",
      width: 200,
    },
    input: {
      marginTop: "8px",
    },
    submit: {
      marginTop: "8px",
    },
  })
);

export const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const classes = useStyles();

  return (
    <Grid container style={{ height: "100vh" }}>
      <Grid xs={6} item>
        <div />
        <div
          style={{
            height: "100%",
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Paper className={classes.paper}>
            <Typography>Login</Typography>
            <TextField
              onChange={(event) => setUserName(event.target.value)}
              variant="outlined"
              label="User Name"
              className={classes.input}
            />
            <TextField
              onChange={(event) => setPassword(event.target.value)}
              variant="outlined"
              label="Password"
              className={classes.input}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={() => console.log(`user: ${userName} pass: ${password}`)}
              className={classes.submit}
            >
              Submit
            </Button>
          </Paper>
        </div>
      </Grid>
      <Grid xs={6} item>
        <div
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            background: "rgba(233,92,48,1)",
            height: "100%",
          }}
        >
          <MsupplyMan />
        </div>
      </Grid>
    </Grid>
  );
};
