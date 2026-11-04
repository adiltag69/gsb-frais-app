import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);           // ToDo 1

  const loginUser = (login, password) => {           // ToDo 2
    if (login === "Andre" && password === "secret") {
      setUser(login);
      return true;
    }
    return false;
  };

  const logoutUser = () => {                          // ToDo 3
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}