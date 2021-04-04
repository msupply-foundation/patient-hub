import { FC } from "react";
import { HashRouter } from "react-router-dom";

import { AuthProvider } from "./AuthProvider";
import { ModalProvider } from "./ModalProvider";
import { TranslationProvider } from "./TranslationProvider";
import { ThemeProvider } from "./ThemeProvider";
import { AppErrorBoundary } from "./AppErrorBoundary";

export const DependencyContainer: FC = (props) => (
  <AppErrorBoundary>
    <ThemeProvider>
      <TranslationProvider locale="en">
        <AuthProvider>
          <HashRouter>
            <ModalProvider>{props.children}</ModalProvider>
          </HashRouter>
        </AuthProvider>
      </TranslationProvider>
    </ThemeProvider>
  </AppErrorBoundary>
);
