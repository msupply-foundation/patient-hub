import { useEffect } from "react";
import { ModalKey } from "../containers/ModalProvider";
import { useAuth } from "./useAuth";
import { useModal } from "./useModal";

export const useLoginPrompt = () => {
  const { username } = useAuth();
  const { open } = useModal(ModalKey.login);

  useEffect(() => {
    if (!username) open();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
