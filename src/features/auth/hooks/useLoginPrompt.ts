import { useEffect } from "react";
import { ModalKey } from "../../../shared/containers/ModalProvider";
import { useAuth } from "./useAuth";
import { useModal } from "../../../shared/hooks/useModal";

export const useLoginPrompt = () => {
  const { username } = useAuth();
  const { open } = useModal(ModalKey.login);

  useEffect(() => {
    if (!username) open();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
