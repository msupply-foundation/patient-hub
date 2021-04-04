import { FC } from "react";
import { HashRouter } from "react-router-dom";

import { AuthProvider } from "./AuthProvider";
import { ModalProvider } from "./ModalProvider";
import { TranslationProvider } from "./TranslationProvider";
import { ThemeProvider } from "./ThemeProvider";
import { AppErrorBoundary } from "./AppErrorBoundary";
import { QueryClientProvider } from "./QueryClientProvider";

export const DependencyContainer: FC = (props) => (
  <AppErrorBoundary>
    <ThemeProvider>
      <TranslationProvider locale="en">
        <AuthProvider>
          <QueryClientProvider>
            <HashRouter>
              <ModalProvider>{props.children}</ModalProvider>
            </HashRouter>
          </QueryClientProvider>
        </AuthProvider>
      </TranslationProvider>
    </ThemeProvider>
  </AppErrorBoundary>
);
