import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuthFetch } from "../context/AuthContext";

const useRedirectToLogin = () => {
  const {
    authState: { username },
  } = useAuthFetch();
  const history = useHistory();

  useEffect(() => {
    if (!username) history.replace("/login");
  }, [username, history]);
};

export default useRedirectToLogin;
