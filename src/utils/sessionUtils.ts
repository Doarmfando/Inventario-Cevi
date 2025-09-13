// src/utils/sessionUtils.ts
import { supabase } from '../lib/supabase';

// Utilidad para diagnosticar problemas de sesión
export const debugSession = async () => {
  console.group('🔍 DEBUG: Estado de Sesión Completo');
  
  try {
    // 1. Verificar datos en localStorage
    console.log('📦 LocalStorage:');
    const localKeys = Object.keys(localStorage);
    const supabaseKeys = localKeys.filter(key => key.includes('supabase'));
    supabaseKeys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        console.log(`  ${key}:`, value ? JSON.parse(value) : 'null');
      } catch {
        console.log(`  ${key}:`, localStorage.getItem(key));
      }
    });

    // 2. Verificar sessionStorage
    console.log('🗃️ SessionStorage:');
    const sessionKeys = Object.keys(sessionStorage);
    const supabaseSessionKeys = sessionKeys.filter(key => key.includes('supabase'));
    supabaseSessionKeys.forEach(key => {
      try {
        const value = sessionStorage.getItem(key);
        console.log(`  ${key}:`, value ? JSON.parse(value) : 'null');
      } catch {
        console.log(`  ${key}:`, sessionStorage.getItem(key));
      }
    });

    // 3. Verificar cookies
    console.log('🍪 Cookies:');
    const cookies = document.cookie.split(';');
    const supabaseCookies = cookies.filter(cookie => 
      cookie.toLowerCase().includes('supabase') || 
      cookie.toLowerCase().includes('auth') ||
      cookie.toLowerCase().includes('session')
    );
    supabaseCookies.forEach(cookie => {
      console.log(`  ${cookie.trim()}`);
    });

    // 4. Verificar sesión actual de Supabase
    console.log('🔐 Supabase Session:');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('  Error:', sessionError);
    } else {
      console.log('  Session:', session);
      if (session?.user) {
        console.log('  User ID:', session.user.id);
        console.log('  User Email:', session.user.email);
        console.log('  Expires At:', new Date(session.expires_at! * 1000));
      }
    }

    // 5. Verificar usuario actual
    console.log('👤 Current User:');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('  Error:', userError);
    } else {
      console.log('  User:', user);
    }

    // 6. Información del navegador
    console.log('🌐 Browser Info:');
    console.log('  User Agent:', navigator.userAgent);
    console.log('  Cookies Enabled:', navigator.cookieEnabled);
    console.log('  Local Storage Available:', typeof(Storage) !== 'undefined');

  } catch (error) {
    console.error('Error en debugSession:', error);
  }
  
  console.groupEnd();
};

// Limpiar completamente todas las sesiones
export const clearAllAuthData = async () => {
  console.log('🧹 Limpiando todos los datos de autenticación...');
  
  try {
    // 1. SignOut de Supabase
    await supabase.auth.signOut();
    
    // 2. Limpiar localStorage
    const localKeys = Object.keys(localStorage);
    localKeys.forEach(key => {
      if (key.includes('supabase') || key.includes('auth')) {
        localStorage.removeItem(key);
        console.log(`  Removido de localStorage: ${key}`);
      }
    });
    
    // 3. Limpiar sessionStorage
    const sessionKeys = Object.keys(sessionStorage);
    sessionKeys.forEach(key => {
      if (key.includes('supabase') || key.includes('auth')) {
        sessionStorage.removeItem(key);
        console.log(`  Removido de sessionStorage: ${key}`);
      }
    });
    
    // 4. Limpiar cookies (limitado por same-origin policy)
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    console.log('✅ Limpieza completa finalizada');
    
    // 5. Recargar página para asegurar estado limpio
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    
  } catch (error) {
    console.error('Error limpiando datos de auth:', error);
  }
};

// Verificar compatibilidad del navegador
export const checkBrowserCompatibility = () => {
  console.group('🌐 Compatibilidad del Navegador');
  
  const checks = {
    localStorage: typeof(Storage) !== 'undefined',
    sessionStorage: typeof(Storage) !== 'undefined',
    cookies: navigator.cookieEnabled,
    fetch: typeof(fetch) !== 'undefined',
    promise: typeof(Promise) !== 'undefined',
    crypto: typeof(crypto) !== 'undefined' && typeof(crypto.subtle) !== 'undefined'
  };
  
  Object.entries(checks).forEach(([feature, supported]) => {
    console.log(`  ${feature}: ${supported ? '✅' : '❌'}`);
  });
  
  // Información adicional del navegador
  console.log('  Browser:', getBrowserInfo());
  console.log('  Platform:', navigator.platform);
  console.log('  Language:', navigator.language);
  
  console.groupEnd();
  
  return checks;
};

// Detectar el navegador
const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
    return 'Opera';
  } else if (userAgent.includes('Edg')) {
    return 'Microsoft Edge';
  } else if (userAgent.includes('Chrome')) {
    return 'Google Chrome';
  } else if (userAgent.includes('Firefox')) {
    return 'Mozilla Firefox';
  } else if (userAgent.includes('Safari')) {
    return 'Safari';
  } else {
    return 'Unknown';
  }
};

// Hook personalizado para debugging en desarrollo
export const useSessionDebug = () => {
  if (process.env.NODE_ENV === 'development') {
    // Agregar funciones al objeto window para acceso fácil desde la consola
    (window as any).debugSession = debugSession;
    (window as any).clearAllAuthData = clearAllAuthData;
    (window as any).checkBrowserCompatibility = checkBrowserCompatibility;
    
    console.log('🔧 Debug tools agregadas al objeto window:');
    console.log('  - window.debugSession()');
    console.log('  - window.clearAllAuthData()');
    console.log('  - window.checkBrowserCompatibility()');
  }
};