import { useMutation } from "react-query";
import axios from "axios";

export const login = ({ username, password }: LoginParams) => {
  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:2048"
      : `${window.location.protocol}//${window.location.host}`;

  return axios
    .post(
      `${url}/api/v4/login`,
      { username, password, loginType: "user" },
      { withCredentials: true }
    )
    .then(({ status }) => status === 200);
};

interface LoginParams {
  username: string;
  password: string;
}

export const useLoginQuery = () => {
  const { isLoading, error, data, mutateAsync } = useMutation("login", login);

  const tryGuestLogin = () =>
    mutateAsync({ username: "guest", password: "tonga-guest-road-skin-frisk" });

  return { isLoading, error, data, tryLogin: mutateAsync, tryGuestLogin };
};
