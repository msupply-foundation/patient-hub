import { useMutation } from "react-query";
import axios from "axios";

// export const login = ({ username, password }: LoginParams) =>
//   axios
//     .post(
//       "http://localhost:2048/api/v4/login",
//       { username, password, loginType: "user" },pre
//       { withCredentials: true }
//     )
//     .then(({ status }) => status === 200);

export const login = () =>
  axios.get(
    "https://t2ytl2iqse.execute-api.ap-southeast-2.amazonaws.com/default/login"
  );

interface LoginParams {
  username: string;
  password: string;
}

export const useLogin = () => {
  const { isLoading, error, data, mutateAsync } = useMutation("login", login);

  return { isLoading, error, data, tryLogin: mutateAsync };
};
