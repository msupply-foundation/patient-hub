import { FC, useState } from "react";
import { Route } from "react-router-dom";
import { useLoginQuery, useAuth } from "../hooks";

export const AutoLoginRoute: FC<{ path: string }> = ({ path, children }) => {
  const { tryLogin } = useLoginQuery();
  const [isLoading, setIsLoading] = useState(false);
  const { guestLogin, username } = useAuth();
  const login = async () => {
    const authenticated = await tryLogin({
      username: "guest",
      password: "tonga-guest-road-skin-frisk",
    });
    if (authenticated) {
      guestLogin();
    }
  };

  if (!isLoading) {
    setIsLoading(true);
    login();
  }

  return <Route path={path}>{username && children}</Route>;
};
