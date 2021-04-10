import { createContext, FC, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { LoginDialog } from "../../features/auth/components/LoginDialog";
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
  const history = useHistory();

  useEffect(() => {
    const unregister = history.listen(({ pathname }) => {
      if (pathname === "/") turnOff();
    });
    return unregister;
  }, [turnOff, history]);

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
