import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  // Load initial isAuthenticated state from local storage, defaulting to false
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  // Update local storage whenever isAuthenticated changes
  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
  }, [isAuthenticated]);

  const login = () => setIsAuthenticated(true);
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated"); // Optionally remove the key from local storage
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, email, setEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
