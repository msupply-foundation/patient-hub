import { useQuery } from "react-query";
import axios from "axios";

export const login = () =>
  axios.get(
    "https://t2ytl2iqse.execute-api.ap-southeast-2.amazonaws.com/default/login"
  );

export const useLogin = () => {
  const { isLoading, isFetching, error, data, refetch } = useQuery(
    "login",
    () =>
      window
        .fetch(
          "https://t2ytl2iqse.execute-api.ap-southeast-2.amazonaws.com/default/login"
        )
        .then((resp) => console.log(resp)),
    { enabled: false }
  );

  return { isLoading, isFetching, error, data, refetch };
};
