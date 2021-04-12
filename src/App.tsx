// https://fontsource.org/#raleway

import { Switch, Route } from "react-router-dom";
import { Box, Typography } from "@material-ui/core";
import { AppBar, Footer, AccountStatus } from "./shared/components";
import { useConfig, useTranslations } from "./shared/hooks";
import { LoginPromptingRoute } from "./features/auth/components/LoginPromptingRoute";
import { AutoLoginRoute } from "./features/auth/components/AutoLoginRoute";
import { PatientForm } from "./features/patients/pages/PatientForm";
import { ADRForm } from "./features/adr/pages/ADRForm";
import { Home } from "./features/app/pages/Home";
import { PatientRegistration } from "./features/patients/pages/PatientRegistration";

export const App = () => {
  const { messages } = useTranslations();
  const config = useConfig();
  const { autologin = { patients: false } } = config;
  const patients = autologin.patients ? (
    <AutoLoginRoute path="/patients">
      <PatientRegistration />
    </AutoLoginRoute>
  ) : (
    <LoginPromptingRoute path="/patients">
      <PatientRegistration />
    </LoginPromptingRoute>
  );
  return (
    <>
      <AppBar RightComponent={<AccountStatus />} />

      <Box bgcolor="#f8fbfe">
        <Box height="30px" />
        <Switch>
          <LoginPromptingRoute path="/adverse-drug-reactions">
            <ADRForm />
          </LoginPromptingRoute>
          {patients}
          <Route path="/">
            <Home />
          </Route>
          <Route path="*">
            <Typography>{messages.pageNotFound}</Typography>
          </Route>
        </Switch>
        <Box height="30px" />
      </Box>

      <Footer />
    </>
  );
};
