import { AuthContext } from "./../containers/AuthProvider";
import { useContext } from "react";

export const useAuth = () => {
  const authState = useContext(AuthContext);
  return authState;
};
