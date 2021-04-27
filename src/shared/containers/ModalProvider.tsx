import { createContext, FC, useCallback, useEffect, useReducer } from "react";

import { useHistory } from "react-router-dom";
import {
  LoginDialog,
  LoginDialogProps,
} from "../../features/auth/components/LoginDialog";
import { useTranslations } from "../hooks";
import { LoadingSpinner, ConfirmationDialog } from "../modal";

export enum ModalKey {
  login = "MODAL_KEY/login",
  confirm = "MODAL_KEY/confirm",
}

export type ModalPropShape = LoginDialogProps | {};
interface ModalContextStateShape {
  modalKey: string;
  isOpen: boolean;
  isLoading: boolean;
  toggleLoading: () => void;
  openModal: (modalKey: ModalKey, modalProps?: ModalPropShape) => void;
  closeModal: () => void;
}

const initialModalContextState = (): ModalContextStateShape => ({
  modalKey: "",
  isOpen: false,
  isLoading: false,
  openModal: (modalKey: ModalKey, modalProps?: ModalPropShape) => {},
  closeModal: () => {},
  toggleLoading: () => {},
});

export const ModalContext = createContext(initialModalContextState());

interface ModalContextInternalStateShape {
  modalKey: ModalKey | "";
  isOpen: boolean;
  isLoading: boolean;
  modalProps: ModalPropShape;
}

enum ModalContextInternalActionType {
  open = "MODAL_CONTEXT/open",
  close = "MODAL_CONTEXT/close",
  toggleLoading = "MODAL_CONTEXT/toggle_loading",
}

type ModalContextInternalAction =
  | {
      type: ModalContextInternalActionType.open;
      payload: { modalKey: ModalKey; modalProps?: ModalPropShape };
    }
  | {
      type: ModalContextInternalActionType.close;
    }
  | { type: ModalContextInternalActionType.toggleLoading };

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

const toggleLoading = (): ModalContextInternalAction => ({
  type: ModalContextInternalActionType.toggleLoading,
});

const initialState = (): ModalContextInternalStateShape => ({
  modalKey: "",
  isLoading: false,
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

    case ModalContextInternalActionType.toggleLoading: {
      const { isLoading } = state;
      return { ...state, isLoading: !isLoading };
    }
    default: {
      return state;
    }
  }
};

export const ModalProvider: FC = (props) => {
  const [{ isOpen, modalKey, modalProps, isLoading }, dispatch] = useReducer(
    reducer,
    initialState()
  );
  const { messages } = useTranslations();

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

  const toggleLoadingIndicator = useCallback(() => {
    dispatch(toggleLoading());
  }, []);

  useEffect(() => {
    const unregister = history.listen(({ pathname }) => {
      if (pathname === "/") closeModal();
    });
    return unregister;
  }, [closeModal, history]);

  return (
    <ModalContext.Provider
      value={{
        modalKey,
        isOpen,
        closeModal,
        openModal,
        isLoading,
        toggleLoading: toggleLoadingIndicator,
      }}
    >
      {props.children}
      <LoginDialog
        open={modalKey === ModalKey.login && isOpen}
        handleClose={closeModal}
        {...modalProps}
      />
      <ConfirmationDialog
        open={modalKey === ModalKey.confirm && isOpen}
        title={messages.success as string}
        handleClose={closeModal}
        {...modalProps}
      />
      <LoadingSpinner open={isLoading} />
    </ModalContext.Provider>
  );
};
