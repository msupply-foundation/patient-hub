import { createContext, Dispatch, useContext, useReducer } from "react";

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "setCredentials":
      const { username, password } = action;
      return {
        username,
        password,
      };
    default:
      return state;
  }
};

interface AuthState {
  username: string;
  password: string;
}

const initialState: AuthState = {
  username: `hufflepuff`,
  password: `d74ff0ee8da3b9806b18c877dbf29bbde50b5bd8e4dad7a3a725000feb82e8f1`,
};

interface AuthContextState {
  authState: AuthState;
  setAuthState: Dispatch<any>;
  authFetch: (url: string, options: any) => Promise<any>;
}

const initialAuthContext: AuthContextState = {
  authState: initialState,
  setAuthState: () => {},
  authFetch: async () => {},
};

const AuthContext = createContext(initialAuthContext);

const AuthProvider = ({ children }: { children: any }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const authState = state;
  const setAuthState = dispatch;
  const { username, password } = state;

  const getAuthHeader = () => ({
    Authorization: "Basic " + btoa(`${username}:${password}`),
  });

  const authFetch = (url: string, options: any): Promise<any> => {
    const existingHeader = options?.headers || {};
    return window.fetch(url, {
      ...options,
      headers: { ...existingHeader, ...getAuthHeader() },
    });
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};
const useAuthFetch = () => useContext(AuthContext);
export { useAuthFetch, AuthProvider };
