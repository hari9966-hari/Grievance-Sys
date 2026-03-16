import React, { createContext, useState, useCallback, useEffect } from 'react';
import Cookie from 'js-cookie';
import { authAPI } from '../services/api';
import { useNotification } from './NotificationContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(Cookie.get('token') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();


  const fetchMe = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authAPI.getMe();
      setUser(response.data.user);
    } catch (err) {
      console.error('Error fetching user:', err);
      Cookie.remove('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize user on app load
  useEffect(() => {
    if (token) {
      fetchMe();
    }
  }, [token, fetchMe]);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.login(email, password);
      const { token: newToken, user: newUser } = response.data;

      Cookie.set('token', newToken, { expires: 7 });
      setToken(newToken);
      setUser(newUser);

      return { success: true, user: newUser };
    } catch (err) {
      const isStringDesc = typeof err.response?.data === 'string';
      const message = err.response?.data?.message || (isStringDesc ? err.response.data : (err.message || 'Login failed'));
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.register(data);
      const { token: newToken, user: newUser } = response.data;

      Cookie.set('token', newToken, { expires: 7 });
      setToken(newToken);
      setUser(newUser);

      return { success: true, user: newUser };
    } catch (err) {
      const isStringDesc = typeof err.response?.data === 'string';
      const message = err.response?.data?.message || (isStringDesc ? err.response.data : (err.message || 'Registration failed'));
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    Cookie.remove('token');
    setToken(null);
    setUser(null);
    setError(null);
    showNotification('Logged out successfully', 'info');
  }, [showNotification]);

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isCitizen: user?.role === 'citizen',
    isOfficer: user?.role === 'officer',
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
