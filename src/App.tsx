// https://fontsource.org/#raleway

import { Switch, Route } from "react-router-dom";
import { Box, Typography } from "@material-ui/core";

import { AppBar, Footer, AccountStatus } from "./ui/components";
import { PatientForm, ADRForm, Home } from "./ui/pages";
import { LoginPromptingRoute } from "./ui/containers";
import { useTranslations } from "./ui/hooks";

export const App = () => {
  const { messages } = useTranslations();

  return (
    <>
      <AppBar RightComponent={<AccountStatus />} />

      <Box height="30px" />

      <Switch>
        <LoginPromptingRoute path="/adverse-drug-reactions">
          <ADRForm />
        </LoginPromptingRoute>
        <LoginPromptingRoute path="/patients">
          <PatientForm />
        </LoginPromptingRoute>
        <Route path="/">
          <Home />
        </Route>
        <Route path="*">
          <Typography>{messages.pageNotFound}</Typography>
        </Route>
      </Switch>

      <Box height="30px" />

      <Footer />
    </>
  );
};
