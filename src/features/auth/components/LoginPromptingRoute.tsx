import { FC } from "react";
import { Route } from "react-router-dom";
import { useLoginPrompt } from "../hooks/useLoginPrompt";

export const LoginPromptingRoute: FC<{ path: string }> = ({
  path,
  children,
}) => {
  useLoginPrompt();
  return <Route path={path}>{children}</Route>;
};
