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
  username: string;
}

const initialState = (): AuthStateContextState => ({ username: "" });

const reducer = (
  state: AuthStateContextState = initialState(),
  action: AuthActionShapes
) => {
  switch (action.type) {
    case AuthActionType.login:
      const { payload } = action;
      const { username } = payload;
      return { username };
    case AuthActionType.logout:
      return initialState();
    default:
      return state;
  }
};

export const useAuthContextState = () => {
  const [{ username }, dispatch] = useReducer(reducer, initialState());

  const login = useCallback((username: string) => {
    dispatch(AuthAction.login(username));
  }, []);

  const guestLogin = useCallback(() => {
    dispatch(AuthAction.login("Guest"));
  }, []);

  const logout = useCallback(() => {
    dispatch(AuthAction.logout());
  }, []);

  return { username, login, guestLogin, logout };
};

interface AuthState {
  username: string;
  login: (username: string) => void;
  logout: () => void;
  guestLogin: () => void;
}

const authStateInitialState: () => AuthState = () => ({
  username: "",
  login: (username: string) => {},
  logout: () => {},
  guestLogin: () => {},
});

export const AuthContext = createContext(authStateInitialState());

export const AuthProvider: FC = (props) => {
  const { username, login, logout, guestLogin } = useAuthContextState();

  return (
    <AuthContext.Provider
      value={{ username, login, logout, guestLogin }}
      {...props}
    />
  );
};
