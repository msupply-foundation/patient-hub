import { AuthContext } from "../AuthProvider";
import { useContext, useEffect } from "react";
import { useConfig, useModal } from "../../../shared/hooks";
import { ModalKey } from "../../../shared/containers/ModalProvider";

export const useAuth = () => {
  const authState = useContext(AuthContext);
  return authState;
};

export const useLoginPrompt = () => {
  const { username, isGuest } = useAuth();
  const { open } = useModal(ModalKey.login);
  const { allowGuestAccess } = useConfig();
  const loginRequired = !username || (isGuest && !allowGuestAccess);

  useEffect(() => {
    if (loginRequired) open();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
