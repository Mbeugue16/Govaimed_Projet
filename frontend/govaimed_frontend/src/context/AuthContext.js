import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthToken, isTokenValid, decodeToken, removeAuthToken } from '../api/endpoint';
import { AUTH_CHANGED_EVENT } from '../utils/authSession';

const AuthContext = createContext(null);

const readStoredProfile = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const mergeUserFromToken = () => {
  const token = getAuthToken();
  if (!token || !isTokenValid(token)) return null;

  const decoded = decodeToken(token);
  if (!decoded) return null;

  const stored = readStoredProfile();
  return {
    ...decoded,
    ...(stored || {}),
    id: decoded.id || stored?.id,
    role: decoded.role || stored?.role,
    email: decoded.email || stored?.email,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => mergeUserFromToken());
  const navigate = useNavigate();

  const refreshUser = useCallback(() => {
    setUser(mergeUserFromToken());
  }, []);

  useEffect(() => {
    const handleAuthChange = () => refreshUser();
    window.addEventListener(AUTH_CHANGED_EVENT, handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [refreshUser]);

  const logout = useCallback(() => {
    removeAuthToken();
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
