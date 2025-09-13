// src/features/auth/services/authService.ts
import { supabase } from '../../../lib/supabase';
import type { User } from '../types';

// Control de logging
const LOG_LEVEL = process.env.NODE_ENV === 'development' ? 'minimal' : 'none';

export class AuthService {
  
  private static async resolveToEmail(usernameOrEmail: string): Promise<string | null> {
    try {
      // Si ya es un email, devolverlo
      if (usernameOrEmail.includes('@')) {
        return usernameOrEmail;
      }

      // Buscar email por username
      const { data, error } = await supabase
        .from('usuarios')
        .select('email')
        .eq('nombre_usuario', usernameOrEmail)
        .eq('visible', true)
        .single();

      if (error || !data?.email) {
        return null;
      }

      return data.email;
      
    } catch (error) {
      return null;
    }
  }

  static async login(usernameOrEmail: string, password: string): Promise<User | null> {
    try {
      // Validar inputs
      if (!usernameOrEmail || !password) {
        return null;
      }
      
      // Cerrar sesión existente si hay
      const { data: currentSession } = await supabase.auth.getSession();
      if (currentSession?.session) {
        await supabase.auth.signOut();
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Resolver username a email
      const email = await this.resolveToEmail(usernameOrEmail);
      
      if (!email) {
        if (LOG_LEVEL === 'minimal') {
          console.error('❌ Usuario no encontrado');
        }
        return null;
      }
      
      // Autenticar con Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      });

      if (authError || !authData.user) {
        if (LOG_LEVEL === 'minimal') {
          console.error('❌ Credenciales inválidas');
        }
        return null;
      }
      
      // Esperar para establecer sesión
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Obtener datos del usuario
      const userData = await this.getUserData(authData.user.email!);
      
      if (!userData) {
        await supabase.auth.signOut();
        return null;
      }
      
      return userData;
      
    } catch (error) {
      if (LOG_LEVEL === 'minimal') {
        console.error('❌ Error en login');
      }
      return null;
    }
  }

  static async getUserData(email: string): Promise<User | null> {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      
      // Consulta con JOIN para obtener rol
      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          id,
          nombre_usuario,
          nombre,
          email,
          rol_id,
          visible,
          rol:roles!usuarios_rol_id_fkey(
            id,
            nombre,
            descripcion
          )
        `)
        .eq('email', normalizedEmail)
        .eq('visible', true)
        .single();

      if (error) {
        // Intentar consulta simple si falla el JOIN
        const { data: simpleData, error: simpleError } = await supabase
          .from('usuarios')
          .select('id, nombre_usuario, nombre, email, rol_id, visible')
          .eq('email', normalizedEmail)
          .eq('visible', true)
          .single();

        if (simpleError || !simpleData) {
          return null;
        }

        // Obtener el rol por separado
        let rolData = null;
        if (simpleData.rol_id) {
          const { data: rolQuery } = await supabase
            .from('roles')
            .select('id, nombre, descripcion')
            .eq('id', simpleData.rol_id)
            .eq('visible', true)
            .single();

          if (rolQuery) {
            rolData = rolQuery;
          }
        }

        // Usar rol por defecto si no se encuentra
        if (!rolData) {
          rolData = {
            id: simpleData.rol_id || 'default-role',
            nombre: 'usuario',
            descripcion: 'Usuario estándar'
          };
        }

        return {
          id: String(simpleData.id),
          nombre_usuario: String(simpleData.nombre_usuario),
          nombre: String(simpleData.nombre || simpleData.nombre_usuario),
          email: String(simpleData.email),
          rol: {
            id: String(rolData.id),
            nombre: rolData.nombre as 'administrador' | 'usuario',
            descripcion: String(rolData.descripcion || '')
          }
        };
      }
      
      if (!data) {
        return null;
      }

      // Procesar el rol
      let rolData = data.rol ? (Array.isArray(data.rol) ? data.rol[0] : data.rol) : null;

      if (!rolData || !rolData.id || !rolData.nombre) {
        rolData = {
          id: data.rol_id || 'default-role',
          nombre: 'usuario',
          descripcion: 'Usuario estándar'
        };
      }

      return {
        id: String(data.id),
        nombre_usuario: String(data.nombre_usuario),
        nombre: String(data.nombre || data.nombre_usuario),
        email: String(data.email),
        rol: {
          id: String(rolData.id),
          nombre: rolData.nombre as 'administrador' | 'usuario',
          descripcion: String(rolData.descripcion || '')
        }
      };
      
    } catch (error) {
      return null;
    }
  }

  // FUNCIÓN DE LOGOUT MEJORADA Y COMPLETA
  static async logout(): Promise<void> {
    try {
      if (LOG_LEVEL === 'minimal') {
        console.log('🚪 Iniciando proceso de logout...');
      }
      
      // 1. Cerrar sesión en Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Error en signOut:', error);
        // Continuar con la limpieza aunque falle el signOut
      }
      
      // 2. Limpiar todo el localStorage relacionado con Supabase
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
          console.log(`🧹 Removido: ${key}`);
        }
      });
      
      // 3. Limpiar sessionStorage
      const sessionKeysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.includes('supabase') || key.includes('auth'))) {
          sessionKeysToRemove.push(key);
        }
      }
      
      sessionKeysToRemove.forEach(key => {
        sessionStorage.removeItem(key);
      });
      
      // 4. Limpiar cookies (si las hay)
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
        if (name.includes('supabase') || name.includes('auth')) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
        }
      });
      
      if (LOG_LEVEL === 'minimal') {
        console.log('✅ Logout completado y sesión limpiada');
      }
      
    } catch (error) {
      console.error('💥 Error durante logout:', error);
      throw error;
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser();
      
      if (error || !authUser?.email) {
        return null;
      }
      
      return await this.getUserData(authUser.email);
    } catch (error) {
      return null;
    }
  }

  static isAdmin(user: User | null): boolean {
    return user?.rol?.nombre === 'administrador';
  }
}