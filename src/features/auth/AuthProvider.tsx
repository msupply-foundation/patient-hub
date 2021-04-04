import { createContext, FC, useCallback, useReducer } from "react";

enum AuthActionType {
  login = "AUTH/LOGIN",
  logout = "AUTH/LOGOUT",
}

type AuthActionShapes =
  | {
      type: AuthActionType.login;
      payload: { username: string; password: string };
    }
  | { type: AuthActionType.logout };

interface AuthActions {
  login: (username: string, password: string) => AuthActionShapes;
  logout: () => AuthActionShapes;
}

const AuthAction: AuthActions = {
  login: (username, password) => ({
    type: AuthActionType.login,
    payload: { username, password },
  }),
  logout: () => ({ type: AuthActionType.logout }),
};

interface AuthStateContextState {
  username: string;
  password: string;
}

const initialState = (): AuthStateContextState => ({
  // username: `hufflepuff`,
  // password: `d74ff0ee8da3b9806b18c877dbf29bbde50b5bd8e4dad7a3a725000feb82e8f1`,
  username: "",
  password: "",
});

const reducer = (
  state: AuthStateContextState = initialState(),
  action: AuthActionShapes
) => {
  switch (action.type) {
    case AuthActionType.login:
      const { payload } = action;
      const { username, password } = payload;
      return {
        username,
        password,
      };
    case AuthActionType.logout:
      return initialState();
    default:
      return state;
  }
};

export const useAuthContextState = () => {
  const [{ username }, dispatch] = useReducer(reducer, initialState());

  const login = useCallback((username: string, password: string) => {
    dispatch(AuthAction.login(username, password));
  }, []);

  const guestLogin = useCallback(() => {
    dispatch(AuthAction.login("guest", "guest"));
  }, []);

  const logout = useCallback(() => {
    dispatch(AuthAction.logout());
  }, []);

  return { username, login, guestLogin, logout };
};

interface AuthState {
  username: string;
  login: (username: string, password: string) => void;
  logout: () => void;
  guestLogin: () => void;
}

const authStateInitialState: () => AuthState = () => ({
  username: "",
  login: (username: string, password: string) => {},
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
