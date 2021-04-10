import { createContext, FC, useCallback, useEffect, useReducer } from "react";
import { useHistory } from "react-router-dom";
import {
  LoginDialog,
  LoginDialogProps,
} from "../../features/auth/components/LoginDialog";

export enum ModalKey {
  login = "MODAL_KEY/login",
}

export type ModalPropShape = LoginDialogProps | {};
interface ModalContextStateShape {
  modalKey: string;
  isOpen: boolean;
  openModal: (modalKey: ModalKey, modalProps?: ModalPropShape) => void;
  closeModal: () => void;
}

const initialModalContextState = (): ModalContextStateShape => ({
  modalKey: "",
  isOpen: false,
  openModal: (modalKey: ModalKey, modalProps?: ModalPropShape) => {},
  closeModal: () => {},
});

export const ModalContext = createContext(initialModalContextState());

interface ModalContextInternalStateShape {
  modalKey: ModalKey | "";
  isOpen: boolean;
  modalProps: ModalPropShape;
}

enum ModalContextInternalActionType {
  open = "MODAL_CONTEXT/open",
  close = "MODAL_CONTEXT/close",
}

type ModalContextInternalAction =
  | {
      type: ModalContextInternalActionType.open;
      payload: { modalKey: ModalKey; modalProps?: ModalPropShape };
    }
  | {
      type: ModalContextInternalActionType.close;
    };

const openModalCreator = (
  modalKey: ModalKey,
  modalProps: ModalPropShape = {}
): ModalContextInternalAction => ({
  type: ModalContextInternalActionType.open,
  payload: { modalKey, modalProps },
});

const closeModalCreator = (): ModalContextInternalAction => ({
  type: ModalContextInternalActionType.close,
});

const initialState = (): ModalContextInternalStateShape => ({
  modalKey: "",
  isOpen: false,
  modalProps: {},
});

const reducer = (
  state: ModalContextInternalStateShape = initialState(),
  action: ModalContextInternalAction
): ModalContextInternalStateShape => {
  switch (action.type) {
    case ModalContextInternalActionType.open: {
      const { payload } = action;
      const { modalKey, modalProps = {} } = payload;

      return { ...state, modalKey, modalProps, isOpen: true };
    }
    case ModalContextInternalActionType.close: {
      return { ...state, modalKey: "", modalProps: {}, isOpen: false };
    }
    default: {
      return state;
    }
  }
};

export const ModalProvider: FC = (props) => {
  const [{ isOpen, modalKey, modalProps }, dispatch] = useReducer(
    reducer,
    initialState()
  );

  const history = useHistory();

  const openModal = useCallback(
    (modalKey: ModalKey, modalProps?: ModalPropShape) => {
      dispatch(openModalCreator(modalKey, modalProps));
    },
    []
  );

  const closeModal = useCallback(() => {
    dispatch(closeModalCreator());
  }, []);

  useEffect(() => {
    const unregister = history.listen(({ pathname }) => {
      if (pathname === "/") closeModal();
    });
    return unregister;
  }, [closeModal, history]);

  return (
    <ModalContext.Provider value={{ modalKey, isOpen, closeModal, openModal }}>
      {props.children}
      <LoginDialog
        open={modalKey === ModalKey.login && isOpen}
        handleClose={closeModal}
        {...modalProps}
      />
    </ModalContext.Provider>
  );
};
