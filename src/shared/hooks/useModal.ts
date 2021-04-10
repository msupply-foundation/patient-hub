import { useContext } from "react";
import {
  ModalContext,
  ModalKey,
  ModalPropShape,
} from "../containers/ModalProvider";

export const useModal = (modalKey: ModalKey) => {
  const { modalKey: openModalKey, isOpen, closeModal, openModal } = useContext(
    ModalContext
  );

  return {
    isOpen: modalKey === openModalKey && isOpen,
    close: closeModal,
    open: (modalProps?: ModalPropShape) => openModal(modalKey, modalProps),
  };
};
