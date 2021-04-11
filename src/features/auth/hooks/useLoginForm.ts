import { useState } from "react";

export const useLoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const reset = () => {
    setUsername("");
    setPassword("");
  };

  const isFilled = username && password;

  return { username, password, setUsername, setPassword, isFilled, reset };
};
