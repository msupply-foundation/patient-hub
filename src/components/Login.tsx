// import { Patients } from "./pages";
import React, { useState } from "react";
// import { AuthProvider, useAuthFetch } from './context/AuthContext.jsx';

import { Button, Paper, TextField, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";

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
    <div className={classes.container}>
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
  );
};
