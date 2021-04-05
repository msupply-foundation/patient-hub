import { FC } from "react";
import { HashRouter } from "react-router-dom";

import { AuthProvider } from "../../features/auth/AuthProvider";
import { ModalProvider } from "./ModalProvider";
import { TranslationProvider } from "./TranslationProvider";
import { ThemeProvider } from "./ThemeProvider";
import { AppErrorBoundary } from "./AppErrorBoundary";
import { QueryClientProvider } from "./QueryClientProvider";
import { PreFetchContainer } from "./PreFetchContainer";

export const DependencyContainer: FC = (props) => (
  <AppErrorBoundary>
    <ThemeProvider>
      <TranslationProvider locale="en">
        <AuthProvider>
          <QueryClientProvider>
            <PreFetchContainer>
              <HashRouter>
                <ModalProvider>{props.children}</ModalProvider>
              </HashRouter>
            </PreFetchContainer>
          </QueryClientProvider>
        </AuthProvider>
      </TranslationProvider>
    </ThemeProvider>
  </AppErrorBoundary>
);
