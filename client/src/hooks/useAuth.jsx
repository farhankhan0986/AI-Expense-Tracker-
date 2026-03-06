import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password);
    const userData = data.user || { email, name: email.split('@')[0] };
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return data;
  }, []);

  const register = useCallback(async (name, email, password, monthlyBudget) => {
    const data = await api.register(name, email, password, monthlyBudget);
    const userData = data.user || { name, email, monthlyBudget };
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const value = { user, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;
