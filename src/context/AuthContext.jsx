import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as authApi from '../api/auth';
import * as usuarioApi from '../api/usuario';
import { storage } from '../utils/storage';

const AuthContext = createContext(null);

function enviarTokenParaAppInventor() {
  if (typeof window !== 'undefined' && window.AppInventor) {
    const token = storage.getToken ? storage.getToken() : localStorage.getItem('token');
    if (token) {
      console.log('[AuthContext] Enviando token para App Inventor:', token.length, 'caracteres');
      window.AppInventor.setWebViewString(`sapience:token:${token}`);
    } else {
      console.warn('[AuthContext] Token não encontrado no storage!');
    }
  }
}

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
        
        enviarTokenParaAppInventor();
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (identifier, password) => {
    const data = await authApi.login({ identifier, password });
    setUser(data.user);

    setTimeout(() => {
      enviarTokenParaAppInventor();
    }, 100);

    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authApi.register(payload);
    setUser(data.user);
    
    setTimeout(() => {
      enviarTokenParaAppInventor();
    }, 100);
    
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