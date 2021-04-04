import { FC } from "react";
import {
  QueryClient,
  QueryClientProvider as RQueryClientProvider,
} from "react-query";

const queryClient = new QueryClient();

export const QueryClientProvider: FC = ({ children }) => {
  return (
    <RQueryClientProvider client={queryClient}>{children}</RQueryClientProvider>
  );
};
