import { FC, useState } from "react";
import { Route } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useLogin } from "../hooks/useLoginQuery";

export const AutoLoginRoute: FC<{ path: string }> = ({ path, children }) => {
  const { tryLogin } = useLogin();
  const [isLoading, setIsLoading] = useState(false);
  const { guestLogin, username } = useAuth();
  const login = async () => {
    const authenticated = await tryLogin({ username: "guest", password: "tonga-guest-road-skin-frisk" });
    if (authenticated) {
      guestLogin();
    }
  };

  if (!isLoading) {
    setIsLoading(true);
    login();
  }

  return (
    <Route path={path}>
      {username && children}
    </Route>
  );
};
