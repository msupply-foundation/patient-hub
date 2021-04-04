// https://fontsource.org/#raleway

import { Switch, Route } from "react-router-dom";
import { Box, Typography } from "@material-ui/core";
import { AppBar, Footer, AccountStatus } from "./shared/components";
import { useTranslations } from "./shared/hooks";
import { LoginPromptingRoute } from "./features/auth/components/LoginPromptingRoute";
import { PatientForm } from "./features/patients/pages/PatientForm";
import { ADRForm } from "./features/adr/pages/ADRForm";
import { Home } from "./features/app/pages/Home";

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
