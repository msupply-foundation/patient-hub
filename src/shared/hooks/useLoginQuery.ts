import { useQuery } from "react-query";

export const useLoginQuery = () => {
  const { isFetching, error, refetch } = useQuery(
    "login",
    () =>
      window
        .fetch(
          "https://t2ytl2iqse.execute-api.ap-southeast-2.amazonaws.com/default/login"
        )
        .then((resp) => console.log(resp)),
    { enabled: false }
  );

  return { isLoading: isFetching, error, refetch };
};
