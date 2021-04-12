import { AuthContext } from "../AuthProvider";
import { useContext, useEffect } from "react";
import { useModal } from "../../../shared/hooks";
import { ModalKey } from "../../../shared/containers/ModalProvider";

export const useAuth = () => {
  const authState = useContext(AuthContext);
  return authState;
};

export const useLoginPrompt = () => {
  const { username } = useAuth();
  const { open } = useModal(ModalKey.login);

  useEffect(() => {
    if (!username) open();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
