import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const USER_KEY = "store-pilot:user";
const TOKEN_KEY = "token";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const storedUser = window.localStorage.getItem(USER_KEY);
      const storedToken = window.localStorage.getItem(TOKEN_KEY);
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch {
      setUser(null);
      setToken(null);
    } finally {
      setReady(true);
    }
  }, []);

  const login = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    try {
      window.localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      window.localStorage.setItem(TOKEN_KEY, nextToken);
    } catch {
      // ignore
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      window.localStorage.removeItem(USER_KEY);
      window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      // ignore
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    login,
    logout,
    ready
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

