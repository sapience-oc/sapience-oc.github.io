import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as authApi from '../api/auth';
import * as usuarioApi from '../api/usuario';
import { storage } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const restoredUser = await authApi.getCurrentUser();
      if (mounted) {
        setUser(restoredUser);
        setBooting(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (identifier, password) => {
    const data = await authApi.login({ identifier, password });
    setUser(data.user);

    if (typeof window !== 'undefined' && window.AppInventor) {
      const token = storage.getToken ? storage.getToken() : localStorage.getItem('token');
      if (token) {
        window.AppInventor.setWebViewString(`sapience:token:${token}`);
      }
    }

    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authApi.register(payload);
    setUser(data.user);
    return data.user;
  }, []);

  const forgotPassword = useCallback(async (email) => {
    return authApi.forgotPassword({ email });
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const updated = await usuarioApi.updatePerfil(payload);
    setUser(updated);
    return updated;
  }, []);

  const refreshUser = useCallback(async () => {
    const fresh = await usuarioApi.getPerfil();
    setUser(fresh);
    return fresh;
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    booting,
    hasOnboarded: storage.hasOnboarded(),
    markOnboarded: storage.setOnboarded,
    login,
    register,
    forgotPassword,
    logout,
    updateProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  return ctx;
}