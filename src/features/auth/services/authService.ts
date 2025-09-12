// src/features/auth/services/authService.ts
import { supabase } from '../../../lib/supabase';
import type { User } from '../types';

export class AuthService {
  
  // Método auxiliar para resolver username a email
  private static async resolveToEmail(usernameOrEmail: string): Promise<string | null> {
    try {
      // Si ya es un email, devolverlo tal como está
      if (usernameOrEmail.includes('@')) {
        console.log('📧 Input es email, usando directamente:', usernameOrEmail);
        return usernameOrEmail;
      }

      // Si es un username, buscar el email correspondiente
      console.log('👤 Input es username, buscando email para:', usernameOrEmail);
      
      const { data, error } = await supabase
        .from('usuarios')
        .select('email')
        .eq('nombre_usuario', usernameOrEmail)
        .eq('visible', true)
        .single();

      if (error) {
        console.error('❌ Error buscando username:', error.message);
        return null;
      }

      if (!data?.email) {
        console.error('❌ No se encontró email para username:', usernameOrEmail);
        return null;
      }

      console.log('✅ Email encontrado para username:', data.email);
      return data.email;
      
    } catch (error) {
      console.error('💥 Error en resolveToEmail:', error);
      return null;
    }
  }

  static async login(usernameOrEmail: string, password: string): Promise<User | null> {
    try {
      console.log('🔐 Iniciando login con:', { input: usernameOrEmail, password: '***' });
      
      // Validar inputs
      if (!usernameOrEmail || !password) {
        console.error('❌ Faltan credenciales');
        return null;
      }
      
      // Resolver username a email si es necesario
      const email = await this.resolveToEmail(usernameOrEmail);
      
      if (!email) {
        console.error('❌ No se pudo resolver el usuario/email');
        return null;
      }

      console.log('📧 Email final para autenticación:', email);
      
      // Intentar autenticación con Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(), // Normalizar email
        password: password
      });

      if (authError) {
        console.error('❌ Error de autenticación:', authError.message);
        
        // Manejar diferentes tipos de error
        if (authError.message.includes('Invalid login credentials')) {
          console.error('🔑 Credenciales inválidas - verificar email/password en Supabase Auth');
        } else if (authError.message.includes('Email not confirmed')) {
          console.error('📨 Email no confirmado');
        }
        
        return null;
      }
      
      if (!authData.user) {
        console.error('❌ No se recibió usuario de Supabase Auth');
        return null;
      }

      console.log('✅ Usuario autenticado en Supabase Auth:', authData.user.email);
      
      // Obtener datos del usuario desde la tabla personalizada
      const userData = await this.getUserData(authData.user.email!);
      
      if (!userData) {
        console.error('❌ No se pudieron obtener los datos del usuario');
        // Cerrar sesión si no se pueden obtener los datos
        await supabase.auth.signOut();
        return null;
      }
      
      console.log('📋 Datos del usuario obtenidos exitosamente:', userData);
      return userData;
      
    } catch (error) {
      console.error('💥 Error en login:', error);
      return null;
    }
  }

  static async getUserData(email: string): Promise<User | null> {
    try {
      console.log('🔍 Buscando datos para email:', email);
      
      // Normalizar email
      const normalizedEmail = email.trim().toLowerCase();
      
      // Hacer la consulta con JOIN para obtener rol
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
        console.error('❌ Error en consulta getUserData:', error.message);
        
        // Si falla el JOIN, intentar consulta simple
        console.log('🔄 Reintentando con consulta simple...');
        const { data: simpleData, error: simpleError } = await supabase
          .from('usuarios')
          .select('id, nombre_usuario, nombre, email, rol_id, visible')
          .eq('email', normalizedEmail)
          .eq('visible', true)
          .single();

        if (simpleError) {
          console.error('❌ Error en consulta simple:', simpleError.message);
          return null;
        }

        console.log('📋 Datos simples obtenidos:', simpleData);
        
        // Obtener el rol por separado si existe rol_id
        let rolData = null;
        if (simpleData.rol_id) {
          const { data: rolQuery, error: rolError } = await supabase
            .from('roles')
            .select('id, nombre, descripcion')
            .eq('id', simpleData.rol_id)
            .eq('visible', true)
            .single();

          if (!rolError && rolQuery) {
            rolData = rolQuery;
            console.log('👤 Rol obtenido por separado:', rolData);
          }
        }

        // Usar rol por defecto si no se encuentra
        if (!rolData) {
          console.log('🔧 Usando rol por defecto...');
          rolData = {
            id: 'default-role',
            nombre: 'usuario',
            descripcion: 'Usuario por defecto'
          };
        }

        const user: User = {
          id: String(simpleData.id),
          nombre_usuario: String(simpleData.nombre_usuario),
          nombre: String(simpleData.nombre),
          email: String(simpleData.email),
          rol: {
            id: String(rolData.id),
            nombre: rolData.nombre as 'administrador' | 'usuario',
            descripcion: String(rolData.descripcion)
          }
        };

        console.log('✅ Usuario formateado (recuperación):', user);
        return user;
      }
      
      if (!data) {
        console.error('❌ No se encontró usuario con email:', normalizedEmail);
        return null;
      }

      console.log('📄 Datos crudos del usuario:', data);

      // Validar datos mínimos
      if (!data.id || !data.nombre_usuario || !data.email) {
        console.error('❌ Datos de usuario incompletos');
        return null;
      }

      // Procesar el rol
      let rolData = null;
      if (data.rol) {
        rolData = Array.isArray(data.rol) ? data.rol[0] : data.rol;
      }

      console.log('👤 Datos del rol procesados:', rolData);

      if (!rolData || !rolData.id || !rolData.nombre) {
        console.log('⚠️ El usuario no tiene un rol válido, usando rol por defecto...');
        rolData = {
          id: 'default-role',
          nombre: 'usuario',
          descripcion: 'Usuario por defecto'
        };
      }

      const user: User = {
        id: String(data.id),
        nombre_usuario: String(data.nombre_usuario),
        nombre: String(data.nombre || data.nombre_usuario), // Fallback al username si no hay nombre
        email: String(data.email),
        rol: {
          id: String(rolData.id),
          nombre: rolData.nombre as 'administrador' | 'usuario',
          descripcion: String(rolData.descripcion || '')
        }
      };

      console.log('✅ Usuario formateado correctamente:', user);
      return user;
      
    } catch (error) {
      console.error('💥 Error obteniendo datos del usuario:', error);
      return null;
    }
  }

  static async logout(): Promise<void> {
    try {
      console.log('🚪 Iniciando logout...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Error en logout:', error);
        throw error;
      }
      console.log('✅ Logout exitoso');
    } catch (error) {
      console.error('💥 Error en logout:', error);
      throw error;
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error obteniendo usuario actual:', error);
        return null;
      }
      
      if (!authUser?.email) {
        console.log('No hay usuario autenticado');
        return null;
      }
      
      return await this.getUserData(authUser.email);
    } catch (error) {
      console.error('Error en getCurrentUser:', error);
      return null;
    }
  }

  static isAdmin(user: User | null): boolean {
    return user?.rol?.nombre === 'administrador';
  }
}