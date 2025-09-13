// src/features/auth/providers/AuthProvider.tsx
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { AuthService } from '../services/authService';
import { AuthContext } from '../contexts/AuthContext';
import type { User } from '../types';

// Variable para controlar el nivel de logging
const LOG_LEVEL = process.env.NODE_ENV === 'development' ? 'minimal' : 'none';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const authListenerRef = useRef<any>(null);
  const initializationRef = useRef(false);

  useEffect(() => {
    if (initializationRef.current) return;
    
    initializationRef.current = true;
    
    if (LOG_LEVEL === 'minimal') {
      console.log('🔐 Auth: Inicializando...');
    }

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          if (LOG_LEVEL === 'minimal') {
            console.error('❌ Auth: Error inicial');
          }
          setUser(null);
          setLoading(false);
          return;
        }

        if (session?.user?.email) {
          const userData = await AuthService.getUserData(session.user.email);
          setUser(userData);
          setLoading(false);
          
          if (LOG_LEVEL === 'minimal' && userData) {
            console.log(`✅ Auth: ${userData.nombre_usuario} conectado`);
          }
        } else {
          setUser(null);
          setLoading(false);
        }

        // Listener simplificado
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            // Solo procesar eventos importantes
            if (event === 'SIGNED_IN' && session?.user?.email) {
              const userData = await AuthService.getUserData(session.user.email);
              setUser(userData);
              setLoading(false);
              
              if (LOG_LEVEL === 'minimal' && userData) {
                console.log(`✅ Auth: ${userData.nombre_usuario} inició sesión`);
              }
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
              setLoading(false);
              
              if (LOG_LEVEL === 'minimal') {
                console.log('🚪 Auth: Sesión cerrada');
              }
            }
            // Ignorar TOKEN_REFRESHED y otros eventos para reducir ruido
          }
        );

        authListenerRef.current = subscription;

      } catch (error) {
        if (LOG_LEVEL === 'minimal') {
          console.error('❌ Auth: Error de inicialización');
        }
        setUser(null);
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      if (authListenerRef.current) {
        authListenerRef.current.unsubscribe();
      }
    };
  }, []);

  const login = async (usernameOrEmail: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const userData = await AuthService.login(usernameOrEmail, password);
      
      if (userData) {
        setUser(userData);
        setLoading(false);
        
        if (LOG_LEVEL === 'minimal') {
          console.log(`✅ Auth: ${userData.nombre_usuario} autenticado`);
        }
        return true;
      }
      
      setLoading(false);
      return false;
      
    } catch (error) {
      setLoading(false);
      return false;
    }
  };

  // FUNCIÓN DE LOGOUT MEJORADA Y COMPLETA
  const logout = async (): Promise<void> => {
    try {
      if (LOG_LEVEL === 'minimal') {
        console.log('🚪 Iniciando logout completo...');
      }
      
      setLoading(true);
      
      // 1. Limpiar estado local primero
      setUser(null);
      
      // 2. Cerrar sesión en Supabase
      await AuthService.logout();
      
      // 3. Limpiar todo el localStorage relacionado
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('supabase') || key.includes('auth'))) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        if (LOG_LEVEL === 'minimal') {
          console.log(`🧹 Limpiado: ${key}`);
        }
      });
      
      // 4. Limpiar sessionStorage
      sessionStorage.clear();
      
      // 5. Limpiar cookies si las hay
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
        if (name.includes('supabase') || name.includes('auth')) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        }
      });
      
      setLoading(false);
      
      if (LOG_LEVEL === 'minimal') {
        console.log('✅ Logout completado - Sesión y storage limpiados');
      }
      
      // 6. Pequeña espera para asegurar que todo se procese
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      if (LOG_LEVEL === 'minimal') {
        console.error('❌ Error en logout:', error);
      }
      setLoading(false);
      // Aún así, limpiar el estado local
      setUser(null);
    }
  };

  const isAdmin = AuthService.isAdmin(user);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};