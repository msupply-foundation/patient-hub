import { createContext, FC, useState } from "react";
import { LoginDialog } from "../dialog/LoginDialog";
import { useToggle } from "../hooks/useToggle";

export enum ModalKey {
  login = "MODAL_KEY/login",
}

interface ModalContextStateShape {
  modalKey: string;
  isOpen: boolean;
  openModal: (modalKey: string) => void;
  closeModal: () => void;
}

const modalContextState: ModalContextStateShape = {
  modalKey: "",
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
};

export const ModalContext = createContext(modalContextState);

export const ModalProvider: FC = (props) => {
  const [modalKey, setModalKey] = useState("");
  const { isToggled, turnOn, turnOff } = useToggle(false);

  const openModal = (modalKey: string) => {
    setModalKey(modalKey);
    turnOn();
  };

  const closeModal = () => {
    setModalKey("");
    turnOff();
  };

  return (
    <ModalContext.Provider
      value={{ modalKey, isOpen: isToggled, closeModal, openModal }}
    >
      {props.children}
      <LoginDialog
        open={modalKey === ModalKey.login && isToggled}
        handleClose={closeModal}
      />
    </ModalContext.Provider>
  );
};
