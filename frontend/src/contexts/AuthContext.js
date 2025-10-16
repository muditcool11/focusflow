import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/authApi';
import { getToken, setToken, clearToken } from '../services/tokenStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = getToken();
    if (stored) {
      setTokenState(stored);
      // Optionally decode token to get user info
    }
  }, []);

  function handleLoginSuccess(data) {
    const jwt = data?.token || data?.accessToken || data;
    setToken(jwt);
    setTokenState(jwt);
  }

  async function login(email, password) {
    const data = await apiLogin(email, password);
    handleLoginSuccess(data);
    return data;
  }

  async function register(name, email, password) {
    const data = await apiRegister(name, email, password);
    // Some backends return token on register; handle if present
    if (data?.token || data?.accessToken) {
      handleLoginSuccess(data);
    }
    return data;
  }

  function logout() {
    clearToken();
    setTokenState(null);
    setUser(null);
  }

  const value = useMemo(() => ({ token, user, login, register, logout, isAuthenticated: !!token }), [token, user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

