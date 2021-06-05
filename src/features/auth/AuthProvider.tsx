import { createContext, FC, useCallback, useReducer } from "react";

enum AuthActionType {
  login = "AUTH/LOGIN",
  logout = "AUTH/LOGOUT",
}

type AuthActionShapes =
  | {
      type: AuthActionType.login;
      payload: { username: string };
    }
  | { type: AuthActionType.logout };

interface AuthActions {
  login: (username: string) => AuthActionShapes;
  logout: () => AuthActionShapes;
}

const AuthAction: AuthActions = {
  login: (username) => ({
    type: AuthActionType.login,
    payload: { username },
  }),
  logout: () => ({ type: AuthActionType.logout }),
};

interface AuthStateContextState {
  isGuest: boolean;
  username: string;
}

const initialState = (): AuthStateContextState => ({ isGuest: false, username: "" });

const reducer = (
  state: AuthStateContextState = initialState(),
  action: AuthActionShapes
) => {
  switch (action.type) {
    case AuthActionType.login:
      const { payload } = action;
      const { username } = payload;
      const isGuest = username === "Guest"
      return { isGuest, username };
    case AuthActionType.logout:
      return initialState();
    default:
      return state;
  }
};

export const useAuthContextState = () => {
  const [{ isGuest, username }, dispatch] = useReducer(reducer, initialState());

  const login = useCallback((username: string) => {
    dispatch(AuthAction.login(username));
  }, []);

  const guestLogin = useCallback(() => {
    dispatch(AuthAction.login("Guest"));
  }, []);

  const logout = useCallback(() => {
    dispatch(AuthAction.logout());
  }, []);

  return { isGuest, username, login, guestLogin, logout };
};

interface AuthState {
  isGuest: boolean;
  username: string;
  login: (username: string) => void;
  logout: () => void;
  guestLogin: () => void;
}

const authStateInitialState: () => AuthState = () => ({
  isGuest: false,
  username: "",
  login: (username: string) => {},
  logout: () => {},
  guestLogin: () => {},
});

export const AuthContext = createContext(authStateInitialState());

export const AuthProvider: FC = (props) => {
  const { isGuest, username, login, logout, guestLogin } = useAuthContextState();

  return (
    <AuthContext.Provider
      value={{ isGuest, username, login, logout, guestLogin }}
      {...props}
    />
  );
};
