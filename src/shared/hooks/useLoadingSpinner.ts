import { useContext } from "react";
import { ModalContext } from "../containers/ModalProvider";

export const useLoadingSpinner = () => {
  const { isLoading, toggleLoading } = useContext(ModalContext);

  return {
    isLoading,
    toggleLoading,
  };
};
