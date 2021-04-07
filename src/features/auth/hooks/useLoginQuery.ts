import { useMutation } from "react-query";
import axios from "axios";

export const login = ({ username, password }: LoginParams) => {
  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:2048"
      : window.location.href;
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

export const useLogin = () => {
  const { isLoading, error, data, mutateAsync } = useMutation("login", login);

  return { isLoading, error, data, tryLogin: mutateAsync };
};
